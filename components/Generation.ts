export namespace Generation {
  export async function RenderImage(
    prompt: string,
    cfg_scale: number,
    steps: number,
    init?: Blob,
    mask?: Blob
  ): Promise<Blob> {
    return new Blob();
  }

  export async function PredictText(
    prompt: string,
    temperature: number
  ): Promise<string> {
    return "";
  }
}
