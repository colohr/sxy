module.exports = {
	declare:`
declare @uniqueID(
  # The name of the new ID field, "uid" by default:
  name: String = "uid"

  # Which fields to include in the new ID:
  from: [String] = ["id"]
) on OBJECT

# Since this type just uses the default values of name and from,
# we don't have to pass any arguments to the directive:
type Location @uniqueID {
  id: Int
  address: String
}

# This type uses both the person's name and the personID field,
# in addition to the "Person" type name, to construct the ID:
type Person @uniqueID(from: ["name", "personID"]) {
  personID: Int
  name: String
}`,
	directive:`directive @length(max: Int) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION`,
	date:`directive @date(format: String) on FIELD_DEFINITION`,
	auth:`directive @auth(
  requires: Role = ADMIN,
) on OBJECT | FIELD_DEFINITION

enum Role {
  ADMIN
  REVIEWER
  USER
  UNKNOWN
}

type User @auth(requires: USER) {
  name: String
  banned: Boolean @auth(requires: ADMIN)
  canPost: Boolean @auth(requires: REVIEWER)
}`,
	get inputs(){
		return {
			name:'',
			type: 'GraphQLType',
			locations:['DirectiveLocation.'],
			description: 'Unique ID',
			args: [],
			resolve(object) {}
		}
	}
}