const definitions = [
   {
      "name": "Log mental energy",
      "type": "energy.mental",
      "fields": [
         {
            "label": "Energy level",
            "name": "level",
            "type": "range",
            "properties": {
               "min": 1,
               "max": 100
            }
         }
      ]
   },
   {
      "name": "Log reaction time",
      "type": "energy.reaction",
      "fields": [
         {
            "label": "Aggregate reaction time (ms)",
            "name": "reactionTime",
            "type": "number"
         }
      ]
   },
   {
      "name": "Start sleeping",
      "type": "sleep.start",
      "fields": []
   },
   {
      "name": "End sleeping",
      "type": "sleep.end",
      "fields": []
   },
];

export default definitions;

export function findDefinition(type) {
   let defs = definitions.filter((definition) => {
      return definition.type === type;
   });
   if (defs.length === 0) {
      return null;
   } else {
      return defs[0];
   }
};
