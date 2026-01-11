// Recipes modal functionality

const recipes = {
	martini: {
		title: "מרטיני קלאסי",
		image: "../assets/images/cocktails/martini.jpg",
		ingredients: ["60 מ\"ל ג'ין", '10 מ"ל ורמוט יבש', "זית או לימון"],
		steps: [
			"מזגו את הג'ין והורמוט לכוס ערבוב עם קרח",
			"ערבבו היטב למשך 30 שניות",
			"מזגו לכוס מרטיני מקוררת",
			"הוסיפו זית או קליפת לימון",
		],
	},
	"old-fashioned": {
		title: "אולד פאשן",
		image: "../assets/images/cocktails/old_fashioned.jpg",
		ingredients: [
			'60 מ"ל בורבון',
			"2-3 טיפות ביטרס אנגוסטורה",
			"קוביית סוכר",
			"תפוז",
		],
		steps: [
			"הניחו קוביית סוכר בתחתית הכוס",
			"הוסיפו 2-3 טיפות ביטרס",
			"מעכו את הסוכר עם הביטרס",
			"הוסיפו בורבון וקרח",
			"ערבבו בעדינות",
			"הוסיפו קליפת תפוז",
		],
	},
	mojito: {
		title: "מוחיטו",
		image: "../assets/images/cocktails/mojito.webp",
		ingredients: [
			'50 מ"ל רום לבן',
			'30 מ"ל מיץ ליים',
			'20 מ"ל סירופ סוכר',
			"נענע",
			"סודה",
		],
		steps: [
			"מעכו 8-10 עלי נענה בתחתית הכוס",
			"הוסיפו מיץ ליים וסירופ סוכר",
			"ערבבו היטב",
			"הוסיפו רום וקרח",
			"מזגו סודה",
			"ערבבו בעדינות",
		],
	},
	manhattan: {
		title: "מנהטן",
		image: "../assets/images/cocktails/manhattan.jpg",
		ingredients: [
			'60 מ"ל ויסקי ריי',
			'30 מ"ל ורמוט מתוק',
			"2 טיפות ביטרס אנגוסטורה",
			"דובדבן",
		],
		steps: [
			"מזגו את כל המרכיבים לכוס ערבוב עם קרח",
			"ערבבו היטב למשך 30 שניות",
			"מזגו לכוס קוקטייל מקוררת",
			"הוסיפו דובדבן לקישוט",
		],
	},
	margarita: {
		title: "מרגריטה",
		image: "../assets/images/cocktails/margarita.jpg",
		ingredients: [
			'50 מ"ל טקילה',
			'25 מ"ל קואנטרו',
			'25 מ"ל מיץ ליים',
			"מלח",
		],
		steps: [
			"מלחו את שולי הכוס",
			"מזגו את כל המרכיבים לשייקר עם קרח",
			"נערו היטב למשך 15 שניות",
			"מזגו לכוס מקוררת",
			"הוסיפו קליפת ליים",
		],
	},
	cosmopolitan: {
		title: "קוסמופוליטן",
		image: "../assets/images/cocktails/cosmopolitan.webp",
		ingredients: [
			'45 מ"ל וודקה',
			'25 מ"ל קואנטרו',
			'25 מ"ל מיץ חמוציות',
			'15 מ"ל מיץ ליים',
		],
		steps: [
			"מזגו את כל המרכיבים לשייקר עם קרח",
			"נערו היטב למשך 15 שניות",
			"מזגו לכוס מרטיני מקוררת",
			"קשטו בקליפת תפוז",
		],
	},
	negroni: {
		title: "נגרוני",
		image: "../assets/images/cocktails/negroni.jpg",
		ingredients: [
			"30 מ\"ל ג'ין",
			'30 מ"ל ורמוט מתוק',
			'30 מ"ל קמפרי',
			"תפוז",
		],
		steps: [
			"מזגו את כל המרכיבים לכוס אולד פאשן עם קרח",
			"ערבבו בעדינות",
			"הוסיפו קליפת תפוז",
			"הגישו מיד",
		],
	},
	daiquiri: {
		title: "דאיקירי",
		image: "../assets/images/cocktails/dakiri classic.jpg",
		ingredients: [
			'50 מ"ל רום לבן',
			'25 מ"ל מיץ ליים טרי',
			'20 מ"ל סירופ סוכר',
		],
		steps: [
			"מזגו את כל המרכיבים לשייקר עם קרח",
			"נערו היטב למשך 15 שניות",
			"מזגו לכוס קוקטייל מקוררת",
			"הוסיפו קליפת ליים לקישוט",
		],
	},
	"whiskey-sour": {
		title: "וויסקי סאוור",
		image: "../assets/images/cocktails/whiskeysour.webp",
		ingredients: [
			'50 מ"ל וויסקי בורבון',
			'25 מ"ל מיץ לימון טרי',
			'20 מ"ל סירופ סוכר',
			"(אופציונלי: חלבון ביצה)",
		],
		steps: [
			"מזגו את כל המרכיבים לשייקר",
			"נערו ללא קרח (אם משתמשים בחלבון)",
			"הוסיפו קרח ונערו שוב 15 שניות",
			"מזגו לכוס עם קרח",
			"קשטו בפרוסת לימון או דובדבן",
		],
	},
	"pina-colada": {
		title: "פינה קולדה",
		image: "../assets/images/cocktails/pinacolada.jpg",
		ingredients: ['50 מ"ל רום לבן', '30 מ"ל קרם קוקוס', '60 מ"ל מיץ אננס'],
		steps: [
			"מזגו את כל המרכיבים לבלנדר עם קרח",
			"טחנו עד מרקם חלק",
			"מזגו לכוס גבוהה",
			"קשטו באננס או דובדבן",
		],
	},
};

function showRecipe(recipeName) {
	const modal = document.getElementById("recipeModal");
	const modalBody = document.getElementById("recipeModalBody");

	const recipe = recipes[recipeName];
	if (recipe && modal && modalBody) {
		modalBody.innerHTML = `
            <h2>${recipe.title}</h2>
            <div class="recipe-detail-container">
                <div class="recipe-detail-content">
                    <h3>מרכיבים:</h3>
                    <ul>
                        ${recipe.ingredients.map((ing) => `<li>${ing}</li>`).join("")}
                    </ul>
                    <h3>הוראות הכנה:</h3>
                    <ol>
                        ${recipe.steps.map((step) => `<li>${step}</li>`).join("")}
                    </ol>
                </div>
                <div class="recipe-detail-image">
                    <img src="${recipe.image}" alt="${recipe.title}">
                </div>
            </div>
        `;
		modal.style.display = "block";
	}
}

document.addEventListener("DOMContentLoaded", function () {
	// Close modal when clicking the X button
	const closeBtn = document.querySelector(".modal__close");
	if (closeBtn) {
		closeBtn.onclick = function () {
			const modal = document.getElementById("recipeModal");
			if (modal) {
				modal.style.display = "none";
			}
		};
	}

	// Close modal when clicking outside of it
	window.onclick = function (event) {
		const modal = document.getElementById("recipeModal");
		if (event.target === modal) {
			modal.style.display = "none";
		}
	};
});
