// Food safety and freshness facts to display during loading
export const foodSafetyFacts = [
  "The average American family throws away $1,500 worth of food each year",
  "Storing herbs like flowers in water can extend their life by up to a week",
  "Eggs can last 3-5 weeks in the refrigerator after the pack date",
  "Freezing bread can extend its life by up to 3 months without quality loss",
  "Bananas release ethylene gas that ripens other fruits faster - store separately",
  "Potatoes last longer when stored in a cool, dark place - not the fridge",
  "Tomatoes should be stored at room temperature for best flavor",
  "Cheese wrapped in parchment paper lasts longer than in plastic wrap",
  "Wilted greens can often be revived by soaking in ice water for 15 minutes",
  "The 'sniff test' is often more reliable than sell-by dates for dairy products",
  "Root vegetables last longest when stored unwashed in the crisper drawer",
  "Apples stay fresh up to 8 times longer in the fridge than on the counter",
  "Storing onions and garlic in a dry, ventilated area prevents sprouting",
  "Berries last longer when washed in a vinegar solution before refrigerating",
  "Leftover wine can be frozen in ice cube trays for cooking later",
  "Mushrooms stay fresh longer in a paper bag rather than plastic",
  "Bell peppers last 2-3 weeks in the crisper drawer of your refrigerator",
  "Fresh ginger can be frozen and grated while still frozen",
  "Carrots stay crisp longer when stored submerged in water in the fridge",
  "Wrapping celery in aluminum foil can keep it fresh for up to a month"
];

export function getRandomFact() {
  return foodSafetyFacts[Math.floor(Math.random() * foodSafetyFacts.length)];
}

export function getRandomFacts(count = 3) {
  const shuffled = [...foodSafetyFacts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
