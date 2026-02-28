import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Allowed image MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/heic'
]

// Cloudinary resource interface
interface CloudinaryResource {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  created_at: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 20 // Maximum number of files per upload

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Check if multiple files or single file
    const files: File[] = []
    
    // Handle both single and multiple file uploads
    const fileEntries = formData.getAll('files')
    
    if (fileEntries.length === 0) {
      // Try single file upload
      const singleFile = formData.get('file') as File
      if (singleFile) {
        files.push(singleFile)
      }
    } else {
      // Multiple files
      fileEntries.forEach((file) => {
        if (file instanceof File) {
          files.push(file)
        }
      })
    }

    // Check if any files were uploaded
    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      )
    }

    // Check maximum number of files
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Too many files. Maximum allowed is ${MAX_FILES}.` },
        { status: 400 }
      )
    }

    // Validate all files
    const validationErrors: string[] = []
    files.forEach((file, index) => {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        validationErrors.push(`File ${index + 1}: Invalid file type. Only images are allowed.`)
      }
      if (file.size > MAX_FILE_SIZE) {
        validationErrors.push(`File ${index + 1}: File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`)
      }
    })

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors.join(' ') },
        { status: 400 }
      )
    }

    // Upload all files to Cloudinary in parallel
    const uploadPromises = files.map(async (file, index) => {
      try {
        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Convert buffer to base64
        const base64String = `data:${file.type};base64,${buffer.toString('base64')}`

        // Get folder from form data or use default
        const folder = (formData.get('folder') as string) || 'portfolio'

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64String, {
          folder: folder,
          resource_type: 'image',
          // Optional: Generate a thumbnail version
          eager: [
            { width: 300, height: 200, crop: "fill", gravity: "auto" }
          ],
          eager_async: true
        })

        return {
          success: true,
          index,
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          thumbnail: result.eager?.[0]?.secure_url || result.secure_url,
          original_filename: file.name
        }
      } catch (error) {
        console.error(`Error uploading file ${index + 1}:`, error)
        return {
          success: false,
          index,
          error: error instanceof Error ? error.message : "Upload failed",
          original_filename: file.name
        }
      }
    })

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises)

    // Check if any uploads failed
    const failedUploads = results.filter(r => !r.success)
    const successfulUploads = results.filter(r => r.success)

    // If all uploads failed, return error
    if (failedUploads.length === files.length) {
      return NextResponse.json(
        { 
          error: "All uploads failed",
          details: failedUploads.map(f => f.error)
        },
        { status: 500 }
      )
    }

    // If some uploads failed, return partial success with warnings
    if (failedUploads.length > 0) {
      return NextResponse.json({
        success: true,
        partial: true,
        message: `${successfulUploads.length} of ${files.length} files uploaded successfully`,
        uploaded: successfulUploads.map(u => ({
          url: u.url,
          public_id: u.public_id,
          thumbnail: u.thumbnail,
          width: u.width,
          height: u.height,
          format: u.format,
          original_filename: u.original_filename
        })),
        failed: failedUploads.map(f => ({
          index: f.index,
          error: f.error,
          original_filename: f.original_filename
        }))
      })
    }

    // All uploads successful
    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${files.length} file${files.length !== 1 ? 's' : ''}`,
      uploaded: successfulUploads.map(u => ({
        url: u.url,
        public_id: u.public_id,
        thumbnail: u.thumbnail,
        width: u.width,
        height: u.height,
        format: u.format,
        original_filename: u.original_filename
      }))
    })

  } catch (error) {
    console.error("Cloudinary upload error:", error)
    
    return NextResponse.json(
      { 
        error: "Failed to upload images",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove images from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('public_id')

    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID is required" },
        { status: 400 }
      )
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === 'ok') {
      return NextResponse.json({
        success: true,
        message: "Image deleted successfully"
      })
    } else {
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Cloudinary delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}

// GET endpoint to list images in a folder
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder') || 'portfolio'
    const maxResults = parseInt(searchParams.get('maxResults') || '100')

    // List images in folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: maxResults,
      context: true,
      tags: true
    })

    return NextResponse.json({
      success: true,
      resources: result.resources.map((resource: CloudinaryResource) => ({
        public_id: resource.public_id,
        url: resource.secure_url,
        thumbnail: resource.secure_url.replace('/upload/', '/upload/w_300,h_200,c_fill/'),
        width: resource.width,
        height: resource.height,
        format: resource.format,
        created_at: resource.created_at
      }))
    })

  } catch (error) {
    console.error("Cloudinary list error:", error)
    return NextResponse.json(
      { error: "Failed to list images" },
      { status: 500 }
    )
  }
}