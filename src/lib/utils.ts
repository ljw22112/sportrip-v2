import{type ClassValue,clsx}from'clsx';import{twMerge}from'tailwind-merge';
export function cn(...i:ClassValue[]){return twMerge(clsx(i))}
export function getWeekRange():{start:string;end:string}{
  const now=new Date();
  const mon=new Date(now);mon.setDate(now.getDate()-now.getDay()+1);
  const sun=new Date(mon);sun.setDate(mon.getDate()+6);
  const fmt=(d:Date)=>d.toISOString().slice(0,10);
  return{start:fmt(mon),end:fmt(sun)};
}
export function getMonthRange():{start:string;end:string}{
  const now=new Date();
  const start=new Date(now.getFullYear(),now.getMonth(),1);
  const end=new Date(now.getFullYear(),now.getMonth()+1,0);
  const fmt=(d:Date)=>d.toISOString().slice(0,10);
  return{start:fmt(start),end:fmt(end)};
}
