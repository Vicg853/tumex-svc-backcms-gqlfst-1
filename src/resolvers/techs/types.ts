import {
   Techs
} from '@prisma-gen/type-graphql'

export interface TechsType {
   id: Techs['id']
   createdAt: Techs['createdAt']

   name: Techs['name']
   logo: Techs['logo']
   url: Techs['url']

   aproxExpYears: Techs['aproxExpYears']
   aproxProjUse: Techs['aproxProjUse']

   listAsSkill: Techs['listAsSkill']
   hidden: Techs['hidden']
}