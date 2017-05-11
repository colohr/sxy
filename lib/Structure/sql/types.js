module.exports = [
	
	//Text = Text | Title
	"STRING", //STRING = VARCHAR(255)
	
	//Paragraph | Html
	"TEXT", //String = Paragraph | Html
	
	//Number
	"INTEGER", //Int
	
	//Decimal
	"FLOAT", //Float = Decimal
	"DECIMAL", //Stored as Float Text = DECIMAL
	
	//TF
	"BOOLEAN", //Boolean
	
	//Time = h:mma
	"TIME", //HH:mm:SS = TIME

	//DateTime = M/D/YYYY HH:mm:ssA
	"DATE", //YYYY-MM-DD HH:mm:ss.SSS Z = DATETIME(sql)
	
	//Date = M/D/YYYY
	"DATEONLY", //YYYY-MM-DD = DATE(sql)
	
	//Timestamp = Date.now() = Int
	"NOW", //YYYY-MM-DD HH:mm:ss = NOW()
	
	//ID
	"UUID", //UUID
	"UUIDV1", //UUIDV1
	"UUIDV4", //UUIDV4
	
	
	//"CHAR",
	
	//"BIGINT", //Int
	//"REAL", //Float -
	//"DOUBLE", //Float -
	
	//"BLOB", //Binary storage. Available lengths: `tiny`, `medium`, `long`
	//"RANGE", //Only available in postgres. Range types are data types representing a range of values of some element type (called the range's subtype).
	
	// "VIRTUAL", //In the above code the password is stored plainly in the password field so it can be validated, but is never stored in the DB.
	//Enum:GraphQLEnumType
	//"ENUM" - not using
	
	//"HSTORE", //A key / value column. Only available in postgres.
	//"JSON", //A JSON string column. Only available in postgres.
	//"JSONB", //A pre-processed JSON data column. Only available in postgres.
	
	// "ARRAY", //An array of `type`, e.g. `DataTypes.ARRAY(DataTypes.DECIMAL)`. Only available in postgres.
	// "GEOMETRY", //Only available in PostgreSQL (with PostGIS) or MySQL
	// "GEOGRAPHY" //A geography datatype represents two dimensional spacial objects in an elliptic coord system.


]