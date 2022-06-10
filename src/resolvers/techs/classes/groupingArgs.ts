import {
  InputType,
  Field,
  registerEnumType
} from 'type-graphql'

export enum GroupsTechsFieldsEnum {
  aproxProjUse = 'aproxProjUse',
  aproxExpYears = 'aproxExpYears',
}
registerEnumType(GroupsTechsFieldsEnum, {
  name: "GroupsTechsFieldsEnum",
  description: 'Fields to group techs by'
})

