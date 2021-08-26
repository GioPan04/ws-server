export interface IEvent {
    eventName: 'message' | string;
    payload: IMessage | any;
}
export declare type IMessage = {
    to: string;
    message: string;
};
