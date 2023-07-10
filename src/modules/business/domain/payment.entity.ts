import {
  CurrencyValueObject,
  DateValueObject,
  Entity,
  Ok,
  UID,
} from "types-ddd"

interface PaymentProps {
  id?: UID
  value: CurrencyValueObject
  fee?: CurrencyValueObject
  contractId: UID
  installment: number
  dueDate: DateValueObject
  payDate?: DateValueObject
}

export class Payment extends Entity<PaymentProps> {
  constructor(props: PaymentProps) {
    super(props)
  }
  static create(props: PaymentProps) {
    return Ok(new Payment(props))
  }
}
