import { EditorConfig } from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import List from '@editorjs/list';
// @ts-ignore
import Marker from '@editorjs/marker';
import { Image } from './image';

export const EditorTools: EditorConfig["tools"] = {
  header: Header,
  image: Image,
  marker: Marker,
  list: {
    class: List,
    inlineToolbar: true,
  }
};