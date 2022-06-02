import {
   Objectives
} from '@prisma-gen/type-graphql'

export type ObjectiveProgress = Objectives['progress']

export interface ObjectiveMainType {
   id: Objectives['id']
   createdAt: Objectives['createdAt']

   title: Objectives['title']
   description: Objectives['description']

   progress: ObjectiveProgress
   source: Objectives['source']

   year: Objectives['year']

   hidden: Objectives['hidden']
}