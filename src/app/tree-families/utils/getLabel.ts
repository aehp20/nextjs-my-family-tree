import type { Person } from '@/app/people/types'

export function getLabel(person: Person): string {
  return `${person.first_name} ${person.father_last_name ?? ''} ${
    person.mother_last_name ?? ''
  }`
}
