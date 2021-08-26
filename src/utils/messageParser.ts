import {  IEvent } from '../models/IData';

export default function messageParser(message: string) {
  const data: IEvent = JSON.parse(message);
  return data;
}