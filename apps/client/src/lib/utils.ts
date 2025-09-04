import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
//TODO: change pdf-parse
// import pdf from "pdf-parse";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export async function getPdfContentFromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // const data = await pdf(buffer);
  // return data.text;
}