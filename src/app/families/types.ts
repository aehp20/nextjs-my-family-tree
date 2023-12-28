import { FormInstance } from 'antd/es/form'

import type { Person } from '@/app/people/types'

export interface FamilyFormProps extends FormInstance {
  father: string
  mother: string
  children?: string[]
}

export interface Family {
  father: Person
  mother: Person
  children: Person[]
}
