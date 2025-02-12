export interface ILetter {
  id: string;
  created_at: string;
  send_to: string;
  is_opened: boolean;
  message: string;
  spotify_id: string;
  sender: string;
  revealed_at: string;
  gift_id: ELetterGift;
}

export enum ELetterGift {
  FLOWERS = 1,
  CHOCOLATE = 2,
  DOLL = 3,
  CAKE = 4,
  WINE = 5,
}
