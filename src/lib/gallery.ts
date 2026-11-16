// Curated photos from JayArts shoots (served from /public/gallery, 1600px max).
export type ShootCategory = "Engagements & Weddings" | "Events" | "Graduation Portraits"

export interface GalleryPhoto {
  src: string
  alt: string
  width: number
  height: number
  category: ShootCategory
}

const P = (src: string, alt: string, category: ShootCategory, portrait = true): GalleryPhoto => ({
  src: `/gallery/${src}.jpg`,
  alt,
  category,
  width: portrait ? 1067 : 1600,
  height: portrait ? 1600 : 1068,
})

export const galleryPhotos: GalleryPhoto[] = [
  P("engagement-couple-walk", "Engaged couple walking down the aisle together", "Engagements & Weddings"),
  P("graduation-studio", "Graduate studio portrait with cap and sash", "Graduation Portraits"),
  P("engagement-decor", "Engagement stage decor with gold chairs", "Events", false),
  P("engagement-bride-fan", "Bride-to-be holding a woven fan", "Engagements & Weddings"),
  P("graduation-bouquet", "Graduate holding a sunflower bouquet at night", "Graduation Portraits"),
  P("engagement-groom-aisle", "Groom-to-be making his entrance on the aisle", "Engagements & Weddings", false),
  P("graduation-night-smile", "Smiling graduate portrait at night", "Graduation Portraits"),
  P("engagement-bride-smile", "Bride-to-be smiling during her entrance", "Engagements & Weddings"),
  P("event-venue-wide", "Wide view of a garden event venue with guests", "Events", false),
  P("graduation-pink-suit", "Graduate in a pink suit with stole", "Graduation Portraits"),
  P("engagement-groom-portrait", "Groom-to-be portrait on the aisle", "Engagements & Weddings"),
  P("graduation-seated-night", "Graduate seated portrait at night", "Graduation Portraits"),
  P("engagement-couple-moment", "Couple sharing a moment surrounded by guests", "Engagements & Weddings", false),
  P("graduation-friends", "Three friends celebrating graduation", "Graduation Portraits"),
  P("engagement-bride-portrait", "Bride-to-be portrait with fan", "Engagements & Weddings"),
  P("event-aisle-wide", "Guests lining the aisle at an outdoor ceremony", "Events", false),
  P("graduation-office", "Graduate portrait in a burgundy suit", "Graduation Portraits"),
  P("engagement-couple", "Engaged couple portrait on the aisle", "Engagements & Weddings"),
  P("engagement-parents", "Parents of the couple at the engagement", "Events", false),
  P("graduation-celebrate", "Graduate celebrating with cap raised", "Graduation Portraits"),
  P("engagement-bride-entrance", "Bride-to-be and bridesmaids entrance", "Engagements & Weddings", false),
  P("graduation-sash", "Graduate adjusting her cap", "Graduation Portraits"),
  P("event-tent-wide", "Guests seated under event tents", "Events", false),
  P("graduation-newspaper-bw", "Black and white graduate portrait with newspaper", "Graduation Portraits"),
]

export const galleryCategories: ShootCategory[] = ["Engagements & Weddings", "Events", "Graduation Portraits"]

export const photo = (name: string) => galleryPhotos.find((p) => p.src === `/gallery/${name}.jpg`)!
