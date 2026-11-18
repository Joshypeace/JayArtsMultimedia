// Curated photos from JayArts shoots (served from /public/gallery, 1600px max).
export type ShootCategory = "Night Portraits" | "Studio & Editorial"

export interface GalleryPhoto {
  src: string
  alt: string
  width: number
  height: number
  category: ShootCategory
}

const P = (src: string, alt: string, category: ShootCategory): GalleryPhoto => ({
  src: `/gallery/${src}.jpg`,
  alt,
  category,
  width: 1067,
  height: 1600,
})

export const galleryPhotos: GalleryPhoto[] = [
  P("graduation-studio", "Graduate studio portrait with cap and sash", "Studio & Editorial"),
  P("graduation-bouquet", "Graduate holding a sunflower bouquet at night", "Night Portraits"),
  P("graduation-seated-cap", "Graduate seated on the road holding her cap", "Night Portraits"),
  P("graduation-office", "Graduate portrait in a burgundy suit", "Studio & Editorial"),
  P("graduation-night-smile", "Smiling graduate portrait at night", "Night Portraits"),
  P("graduation-cap-cover", "Graduate covering her face with her cap", "Night Portraits"),
  P("graduation-friends", "Three friends celebrating graduation", "Studio & Editorial"),
  P("graduation-pink-suit", "Graduate in a pink suit with stole", "Night Portraits"),
  P("graduation-kneel-night", "Graduate kneeling with her cap at night", "Night Portraits"),
  P("graduation-newspaper-sepia", "Sepia editorial portrait of a graduate reading the news", "Studio & Editorial"),
  P("graduation-sash", "Graduate adjusting her cap", "Night Portraits"),
  P("graduation-sash-garden", "Graduate in a pink suit with sash in a garden", "Night Portraits"),
  P("graduation-celebrate", "Graduate celebrating with cap raised", "Night Portraits"),
  P("graduation-newspaper-bw", "Black and white graduate portrait with newspaper", "Studio & Editorial"),
  P("graduation-gown-moody", "Moody portrait of a graduate holding her cap", "Night Portraits"),
  P("graduation-seated-night", "Graduate seated portrait at night", "Night Portraits"),
  P("graduation-back-night", "Graduate looking back holding her certificate", "Night Portraits"),
]

export const galleryCategories: ShootCategory[] = ["Night Portraits", "Studio & Editorial"]
