import type { ObjectiveMainType, ObjectiveProgress } from '@resolvers/objectives/types'
import type { RequireAtLeastOne } from '../../types/typefunc'

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
 * @param {ObjectiveMainType[]} The objectives to group.
 * @param {ObjectiveFilterKeys} The filters to apply to the objectives: at least one must be true.
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
