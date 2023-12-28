import { getLabel } from '@/app/tree-families/utils/getLabel'
import type { Family } from '@/app/families/types'
import type { Person } from '@/app/people/types'
import type { NodePerson } from '@/app/tree-families/types'

export const getObjectNodePeople = (families: Family[]) => {
  const objectNodePeople: { [key: string]: NodePerson } = {}
  families.forEach((family: Family) => {
    const { father, mother, children } = family
    objectNodePeople[father.person_id] = {
      id: father.person_id,
      label: getLabel(father),
      parents: [...(objectNodePeople[father.person_id]?.parents || [])],
      siblings: [...(objectNodePeople[father.person_id]?.siblings || [])],
      children: [
        ...(objectNodePeople[father.person_id]?.children || []),
        ...children.map((child: Person) => ({
          id: child.person_id,
          type: 'blood',
        })),
      ],
      spouses: [
        ...(objectNodePeople[father.person_id]?.spouses || []),
        {
          id: mother.person_id,
          type: 'blood',
        },
      ],
    }
    objectNodePeople[mother.person_id] = {
      id: mother.person_id,
      label: getLabel(mother),
      parents: [...(objectNodePeople[mother.person_id]?.parents || [])],
      siblings: [...(objectNodePeople[mother.person_id]?.siblings || [])],
      children: [
        ...(objectNodePeople[mother.person_id]?.children || []),
        ...children.map((child: Person) => ({
          id: child.person_id,
          type: 'blood',
        })),
      ],
      spouses: [
        ...(objectNodePeople[mother.person_id]?.spouses || []),
        {
          id: father.person_id,
          type: 'blood',
        },
      ],
    }

    children.forEach((child: Person) => {
      objectNodePeople[child.person_id] = {
        id: child.person_id,
        label: getLabel(child),
        parents: [
          ...(objectNodePeople[child.person_id]?.parents || []),
          {
            id: father.person_id,
            type: 'blood',
          },
          {
            id: mother.person_id,
            type: 'blood',
          },
        ],
        siblings: [...(objectNodePeople[child.person_id]?.siblings || [])],
        children: [...(objectNodePeople[child.person_id]?.children || [])],
        spouses: [...(objectNodePeople[child.person_id]?.spouses || [])],
      }
    })
  })
  return objectNodePeople
}
