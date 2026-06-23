import Replicate from 'replicate'

export async function upscaleImage(imageUrl: string): Promise<string> {
  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  const output = await replicate.run(
    'nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b',
    {
      input: {
        image: imageUrl,
        scale: 4,
        face_enhance: false,
      },
    }
  )

  // output is either a string URL or an array
  if (Array.isArray(output)) {
    return output[0] as string
  }
  return output as unknown as string
}
