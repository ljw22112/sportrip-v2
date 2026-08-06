'use client';
import {createContext,useContext,useState,useEffect,ReactNode} from 'react';
import {CompanionType} from '@/components/auth/LoginModal';
import {loadQState,saveQState,updateQ,QState,SpotType} from '@/lib/qlearning';

interface User{nickname:string;companion:CompanionType}
interface UserContextType{
  user:User|null;qstate:QState;
  login:(companion:CompanionType,nickname:string)=>void;
  logout:()=>void;
  reward:(type:SpotType,name:string,points:number)=>void;
}
const Ctx=createContext<UserContextType|null>(null);

export function UserProvider({children}:{children:ReactNode}){
  const[user,setUser]=useState<User|null>(null);
  const[qstate,setQstate]=useState<QState>(()=>({qtable:{},visitCount:{},companion:'solo',totalReward:0,epsilon:0.8}));

  useEffect(()=>{
    const saved=localStorage.getItem('sportrip_user');
    if(saved){try{setUser(JSON.parse(saved));}catch{}}
    setQstate(loadQState());
  },[]);

  const login=(companion:CompanionType,nickname:string)=>{
    const u={nickname,companion};
    setUser(u);
    localStorage.setItem('sportrip_user',JSON.stringify(u));
    const qs={...loadQState(),companion};
    setQstate(qs);saveQState(qs);
  };

  const logout=()=>{
    setUser(null);localStorage.removeItem('sportrip_user');
  };

  const reward=(type:SpotType,name:string,points:number)=>{
    const next=updateQ({...qstate,companion:user?.companion||'solo'},type,name,points);
    setQstate(next);
  };

  return<Ctx.Provider value={{user,qstate,login,logout,reward}}>{children}</Ctx.Provider>;
}
export const useUser=()=>{const c=useContext(Ctx);if(!c)throw new Error('useUser outside provider');return c;};
