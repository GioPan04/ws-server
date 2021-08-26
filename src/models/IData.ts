export interface IEvent {
  eventName: 'message' | string;
  payload: IMessage | any;
};

export type IMessage = {
  to: string;
  message: string;
}