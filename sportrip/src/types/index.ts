export type EventStatus='upcoming'|'ongoing'|'done';
export interface SportEvent{
  id:number;title:string;sport:string;icon:string;
  venue:string;address:string;start:string;end:string;
  status:EventStatus;region:string;desc:string;
  url:string;participants:string;lat:number;lng:number;
  distances?:string;
}
