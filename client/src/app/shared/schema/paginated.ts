export interface Paginated<T>{
  
  docs:T[];
  
  total:number;
  limit:number;
  
  page?:number;
  pages?:number;
  offset?:number;
}