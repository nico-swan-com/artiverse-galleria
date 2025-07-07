import { ArtistsController } from '@/lib/artists/artists.controller'
const controller = new ArtistsController()
export const GET = controller.getAllArtistsPublic.bind(controller)
