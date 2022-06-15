import {
   InputType,
   Field,
   ClassType,
   ArgsType
} from 'type-graphql'

import { AuthMiddle } from '@middlewares/auth'
import { Scopes } from '@config/jwt-tkn'

@ArgsType()
export class TechBasicSharedFilters {
   @AuthMiddle({
      scopes: [Scopes.techHiddenRead]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: "If true, returns only hidden techs. Overrides \"includeHidden\". Requires special permissions."
   })
   onlyHidden?: boolean

   @AuthMiddle({
      scopes: [Scopes.techHiddenRead]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: "If true, returns archived and non-archived techs. Requires special permissions."
   })
   includeHidden?: boolean

   @AuthMiddle({
      scopes: [Scopes.projectsHiddenRead]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Filter by related project hidden state',
   })
   relProjHidden?: boolean

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Filter by related project archived state',
   })
   relProjArchived?: boolean

   @AuthMiddle({
      scopes: [Scopes.projectsHiddenRead]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Filter by only hidden related projects',      
   })
   onlyHiddenRelProj?: boolean

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Filter by only archived related projects',
   })
   onlyArchivedRelProj?: boolean
}

function createAdvancedFilterFields<T>(ClassType: ClassType, label: string) {
   @InputType(`Tech${label}FieldFilters`)
   abstract class TechFieldFilters {
      @Field(_type => ClassType, {
         nullable: true,
         description: `Where ${label} is equals to`,
      })
      equals?: T
   
      @Field(_type => [ClassType], {
         nullable: true,
         description: `Array of ${label}(s) to filter by.`,
      })
      in?: T[]
   
      @Field(_type => Boolean, {
         nullable: true,
         description: `Filter by ${label} field is defined`,
      })
      isSet?: boolean
   }

   return TechFieldFilters
}


@InputType()
class TechConditionalFilter {
   @Field(_type => [TechsAdvancedSharedFilters], {
      nullable: true,
   })
   AND?: TechsAdvancedSharedFilters[]

   @Field(_type => [TechsAdvancedSharedFilters], {
      nullable: true,
   })
   OR?: TechsAdvancedSharedFilters[]

   @Field(_type => [TechsAdvancedSharedFilters], {
      nullable: true,
   })
   NOT?: TechsAdvancedSharedFilters[]
}

const Name = createAdvancedFilterFields<string>(String, 'Name')
const Url = createAdvancedFilterFields<string>(String, 'Url')
const AproxExpYears = createAdvancedFilterFields<number>(Number, 'AproxExpYears')
const AproxProjUse = createAdvancedFilterFields<number>(Number, 'AproxProjUse')

@InputType()
export class TechsAdvancedSharedFilters extends TechConditionalFilter {
   @Field(_type => Name, {
      nullable: true,
   })
   name?: InstanceType<typeof Name>

   @Field(_type => Url, {
      nullable: true,
      description: 'Filter by technology\'s source url',
   })
   url?: InstanceType<typeof Url>

   @Field(_type => AproxExpYears, {
      nullable: true,
      description: 'Filter by years of experience with this technology',
   })
   aproxExpYears?: InstanceType<typeof AproxExpYears>

   @Field(_type => AproxProjUse, {
      nullable: true,
      description: 'Filter by aprox projects using this technology',
   })
   aproxProjUse?: InstanceType<typeof AproxProjUse>

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Filter by technologies that are listed as skills state',
   })
   listAsSkill?: boolean   
}