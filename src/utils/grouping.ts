import type { ObjectiveMainType, ObjectiveProgress } from '@resolvers/objectives/types'
import type { RequireAtLeastOne } from '../../types/typefunc'
import type { TechsType } from '@resolvers/techs/types'
import type { Techs } from '@prisma-gen/type-graphql'

type ObjectiveGroupOut = {
   progress?: ObjectiveProgress,
   year?: number,
   objectives: ObjectiveMainType[],
}[]

type ObjectiveFilterKeys = RequireAtLeastOne<{
   progress?: boolean,
   year?: boolean, 
}, 'progress' | 'year'>

//* Function that groups objectives by one or both progress and year.
/**
 * Function that groups objectives by one or both progress and year.
 * 
 * @param {ObjectiveMainType[]} objectives - The objectives to group.
 * @param {ObjectiveFilterKeys} filterKeys - The filters to apply to the objectives: at least one must be true.
 * @returns {ObjectiveGroupOut} The grouped objectives.
 * 
 * @example
 * const objectives = [
 *  { id: '1', year: 2020, progress: 'IN_PROGRESS' },
 *  { id: '2', year: 2020, progress: 'DONE' }
 * ]
 * 
 * groupObjectives(objectives, { progress: true })
 * // outputs -> [
 * //  { progress: 'IN_PROGRESS', objectives: [{ id: '1', year: 2020 }] },
 * //  { progress: 'DONE', objectives: [{ id: '2', year: 2020 }] }
 * // ]
 * 
*/
export const groupObjectives = <P extends ObjectiveProgress, Y extends number>(objectives: ObjectiveMainType[], 
   filterKeys: ObjectiveFilterKeys): ObjectiveGroupOut  => objectives
   .reduce((acc: ObjectiveGroupOut, curr: ObjectiveMainType) => {
   
      //* Looking for an already existing group object
   const index = acc.findIndex(obj => 
      (!filterKeys.progress ? true : (obj.progress as P) === curr.progress) &&
      (!filterKeys.year ? true : (obj.year as Y) === curr.year))
   
   //* If a group doesn't already exist, create one and append its first objective to it
   if (index < 0) acc.push({
      ...(filterKeys.progress ? { progress: curr.progress } : {}),
      ...(filterKeys.year ? { year: curr.year } : {}),
      objectives: [curr]
   })
   
   //* If a group already exists, simply append the current objective to it
   else acc[index].objectives.push(curr)

   return acc
}, [])



type TechInProjAdditionalFields = {
   projects: string[],
}

type TechGroupOut<TechProjs extends boolean> = {
   aproxProjUse?: TechsType['aproxProjUse'],
   aproxExpYears?: TechsType['aproxExpYears'],
   techs: (TechsType & (TechProjs extends true ? TechInProjAdditionalFields : {}))[],
}

type TechGroupOutArray<T extends boolean> = TechGroupOut<T>[]

type TechGroupOutComposed<T extends boolean> = (TechGroupOut<T> & {
   projId: string | null
})[]

type TechFilterKeys = RequireAtLeastOne<{
   aproxProjUse?: boolean,
   aproxExpYears?: boolean,
}, 'aproxProjUse' | 'aproxExpYears'>


/**
 * Function that groups techs by one or both aproxProjUse and aproxProjUse values.
 * @param {TechStack[]} techs - The techs to group.
 * @param {TechFilterKeys} filterKeys - The filters to apply to the techs: at least one must be true.
 * @returns {TechGroupOut} The grouped techs.
 *
 * @example
 * const techs = [
 * { id: '1', aproxProjUse: 'LOW', aproxExpYears: 1 },
 * { id: '2', aproxProjUse: 'MEDIUM', aproxExpYears: 2 },
 * { id: '3', aproxProjUse: 'HIGH', aproxExpYears: 3 }
 * ]
 *
 * groupTechs(techs, { aproxProjUse: true })
 * // outputs -> [
 * //  { aproxProjUse: 'LOW', techs: [{ id: '1', aproxProjUse: 'LOW', aproxExpYears: 1 }] },
 * //  { aproxProjUse: 'MEDIUM', techs: [{ id: '2', aproxProjUse: 'MEDIUM', aproxExpYears: 2 }] },
 * //  { aproxProjUse: 'HIGH', techs: [{ id: '3', aproxProjUse: 'HIGH', aproxExpYears: 3 }] }
 * // ]
 *
*/ //TODO Refactor and fix ts issues 
export const groupTechs = <P extends TechsType['aproxProjUse'], 
   Y extends TechsType['aproxExpYears'],
   gpId extends boolean, 
   AccType = gpId extends true ? TechGroupOutComposed<gpId> : TechGroupOutArray<gpId>,
   CurrType = TechsType & (gpId extends true ? TechInProjAdditionalFields : {})
   >(techs: CurrType[], 
   filterKeys: TechFilterKeys, //@ts-ignore
   groupProjRelId?: gpId): AccType => techs
   .reduce((acc: AccType, curr: CurrType) => {
   //* Looking for an already existing group object
   //@ts-ignore
   //TODO This shit definitely needs a lot of refactoring and optimization
   const index = acc.findIndex(obj =>
       (!groupProjRelId ? true : 
         obj.projId === null ? 
         //@ts-ignore
            (typeof curr.projects === 'undefined' || curr.projects.length === 0) :
            obj.projects?.includes(obj.projId)
       ) &&
       //@ts-ignore
       (!filterKeys.aproxProjUse ? true : (obj.aproxProjUse as P) === curr.aproxProjUse) &&
         //@ts-ignore
       (!filterKeys.aproxExpYears ? true : (obj.aproxExpYears as Y) === curr.aproxExpYears))
    
   //* If a group doesn't already exist, create one and append its first tech to it
   //@ts-ignore
   if (index < 0) {
      const simplePush = {
         //@ts-ignore
         ...(filterKeys.aproxProjUse ? { aproxProjUse: curr.aproxProjUse } : {}),
         //@ts-ignore
         ...(filterKeys.aproxExpYears ? { aproxExpYears: curr.aproxExpYears } : {}),
         techs: [curr]
      }

      //@ts-ignore
      if(!groupProjRelId) acc.push(simplePush)
      //@ts-ignore
      else if (!curr.projects || curr.projects.length === 0) acc.push({ ...simplePush, projId: null })
      else {
         //@ts-ignore
         const composedPush = curr.projects.map(projId => ({
            //@ts-ignore
            ...simplePush,
            projId
         }))
         //@ts-ignore
         acc.push(...composedPush)
      }         
   }
   //* If a group already exists, simply append the current tech to it
   //@ts-ignore
   else if(!groupProjRelId) acc[index].techs.push(curr)
   //@ts-ignore
   else acc.forEach(obj => {
      //@ts-ignore
      if (obj.projId === null && (curr.projects === null || curr.projects.length === 0))
         obj.techs.push(curr)
      else if (typeof obj.projId === 'string'
         //@ts-ignore
         && curr.projects.includes(obj.projId))
         obj.techs.push(curr)
   })
    
   return acc
}, [])
