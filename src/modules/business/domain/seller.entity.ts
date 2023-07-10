// vendedor em ingles

import { Entity, Ok, Result, UID, UserNameValueObject } from "types-ddd"

interface SellerProps {
  id?: UID
  name: UserNameValueObject
}

export class Seller extends Entity<SellerProps> {
  private constructor(props: SellerProps) {
    super(props)
  }

  public static create(props: SellerProps): Result<Seller> {
    return Ok(new Seller(props))
  }
}
