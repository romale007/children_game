/** Root of this game's files in public/games/shapes. */
export const assetDir = `${import.meta.env.BASE_URL}games/shapes`

export const img = (name: string) => `${assetDir}/images/${name}`
