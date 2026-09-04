import { Pipe, PipeTransform } from '@angular/core';
import { marked } from "marked";

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return "";
    return marked.parse(value, { breaks: true, mangle: false, headerIds: false }) as string;
  }

}
