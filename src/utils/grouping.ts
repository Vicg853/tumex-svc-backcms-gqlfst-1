import type { ObjectiveMainType, ObjectiveProgress } from '@resolvers/objectives/types'
import type { RequireAtLeastOne } from '../../types/typefunc'
import type { TechsType } from '@resolvers/techs/types'

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


//TODO Merge both functions together later

type TechGroupOut = {
   aproxProjUse?: TechsType['aproxProjUse'],
   aproxExpYears?: TechsType['aproxExpYears'],
   techs: TechsType[],
}[]

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
*/

export const groupTechs = <P extends TechsType['aproxProjUse'], Y extends TechsType['aproxExpYears']>(techs: TechsType[], 
   filterKeys: TechFilterKeys): TechGroupOut => techs
   .reduce((acc: TechGroupOut, curr: TechsType) => {
   //* Looking for an already existing group object
   const index = acc.findIndex(obj =>
       (!filterKeys.aproxProjUse ? true : (obj.aproxProjUse as P) === curr.aproxProjUse) &&
       (!filterKeys.aproxExpYears ? true : (obj.aproxExpYears as Y) === curr.aproxExpYears))
    
   //* If a group doesn't already exist, create one and append its first tech to it
   if (index < 0) acc.push({
      ...(filterKeys.aproxProjUse ? { aproxProjUse: curr.aproxProjUse } : {}),
      ...(filterKeys.aproxExpYears ? { aproxExpYears: curr.aproxExpYears } : {}),
      techs: [curr]
   })
    
   //* If a group already exists, simply append the current tech to it
   else acc[index].techs.push(curr)
    
   return acc
}, [])
