import { ProjectOpacityRelatedFilters } from './classes/filterArgs'

/** 
 * @description Returns true if the given project hidden and archived states meet the given filters.
 * @param {ProjectOpacityRelatedFilters} filters
 * @param {archived} - Project archive state
 * @param {hidden} - Project visibility state
 * @returns {Boolean}
*/
export function checkOpacityCondition(
   filterArgs: InstanceType<typeof ProjectOpacityRelatedFilters> | undefined,
   archived: boolean,
   hidden: boolean): boolean {
   if(!filterArgs)
      return !archived && !hidden
   
   const { 
      includeArchived, onlyArchived,
      includeHidden, onlyHidden,
   } = filterArgs

   let filter = true

   if(onlyArchived) filter = filter && archived
   else if(includeArchived) filter = filter
   else filter = filter && !archived
   
   if(onlyHidden) filter = filter && hidden
   else if(includeHidden) filter = filter
   else filter = filter && !hidden
   
   return filter
}