// Burgers
import classicBeefBurger from "../assets/images/Burgers/Classic Beef Burger.jpg";
import cheeseBurger from "../assets/images/Burgers/Cheese Burger.jpg";
import doubleBeefBurger from "../assets/images/Burgers/Double Beef Burger.jpg";
import crispyChickenBurger from "../assets/images/Burgers/Crispy Chicken Burger.jpg";
import spicyChickenBurger from "../assets/images/Burgers/Spicy Chicken Burger.jpg";
import bbqBaconBurger from "../assets/images/Burgers/BBQ Bacon Burger.jpg";
import veggieBurger from "../assets/images/Burgers/Veggie Burger.jpg";
// Quick Bites
import chickenWrap from "../assets/images/Quick Bites/Chicken Wrap.jpg";
import beefWrap from "../assets/images/Quick Bites/Beef Wrap.jpg";
import hotDog from "../assets/images/Quick Bites/Hot Dog.jpg";
import taco from "../assets/images/Quick Bites/Taco.jpg";
import spicyChickenWrap from "../assets/images/Quick Bites/Spicy Chicken Wrap.jpg";
// Chicken
import singleFriedChicken from "../assets/images/Chicken/Single Fried Chicken.jpg";
import doubleFriedChicken from "../assets/images/Chicken/Double Fried Chicken.jpg";
import chickenWings from "../assets/images/Chicken/Chicken Wings.jpg";
import chickenTenders from "../assets/images/Chicken/Chicken Tenders.jpg";
import spicyWings from "../assets/images/Chicken/Spicy Wings.jpg";
import chickenNuggets from "../assets/images/Chicken/Chicken Nuggets.jpg";
// Fries & Sides
import cheeseFries from "../assets/images/Fries/Cheese Fries.jpg";
import curlyFries from "../assets/images/Fries/Curly Fries.jpg";
import nachos from "../assets/images/Fries/Nachos.jpg";
import frenchFries from "../assets/images/Fries/French Fries.jpg";
import onionRings from "../assets/images/Fries/Onion Rings.jpg";
import mozzarellaSticks from "../assets/images/Fries/Mozzarella Sticks.jpg";
// Pizza
import margheritaPizza from "../assets/images/Pizza/Margherita Pizza.jpg";
import bbqChickenPizza from "../assets/images/Pizza/BBQ Chicken Pizza.jpg";
import hawaiianPizza from "../assets/images/Pizza/Hawaiian Pizza.jpg";
import veggiePizza from "../assets/images/Pizza/Veggie Pizza.jpg";
import pepperoniPizza from "../assets/images/Pizza/Pepperoni Pizza.jpg";
// Sandwiches
import clubSandwich from "../assets/images/Sandwiches/Club Sandwich.jpg"
import eggMayoSandwich from "../assets/images/Sandwiches/Egg Mayo Sandwich.jpg"
import chickenSandwich from "../assets/images/Sandwiches/Chicken Sandwich.jpg";
import tunaSandwich from "../assets/images/Sandwiches/Tuna Sandwich.jpg";
// Drinks
import cocaCola from "../assets/images/Drinks/Coca Cola.jpg"
import bobaTea from "../assets/images/Drinks/Boba Tea.jpg"
import lemonIcedTea from "../assets/images/Drinks/Lemon Iced Tea.jpg"
import milkShake from "../assets/images/Drinks/Milkshake.jpg"
import pepsi from "../assets/images/Drinks/Pepsi.jpg"
import sprite from "../assets/images/Drinks/Sprite.jpg"
// Desserts
import brownie from "../assets/images/Desserts/Brownie.jpg"
import falooda from "../assets/images/Desserts/Falooda.jpg"
import fruitSalad from "../assets/images/Desserts/Fruit Salad.jpg"
import miniDonuts from "../assets/images/Desserts/Mini Donuts.jpg"
import sundaeIceCream from "../assets/images/Desserts/Sundae Ice Cream.jpg"

// Popular Dishes Data
export const popularDishes = [
    {
        id : 1,
        image : cheeseBurger, 
        name : "Cheese Burger",
        numberOfOrders : 120,
    },
    {
        id : 2,
        image : spicyChickenWrap, 
        name : "Spicy Chicken Wrap",
        numberOfOrders : 95,
    },
    {
        id : 3,
        image : spicyWings,
        name : "Spicy Wings",
        numberOfOrders : 90,
    },
    {
        id : 4,
        image : chickenNuggets,
        name : "Chicken Nuggets",
        numberOfOrders : 85,
    },
    {
        id : 5,
        image : frenchFries,
        name : "French Fries",
        numberOfOrders : 82,
    },
    {
        id : 6,
        image : onionRings,
        name : "Onion Rings",
        numberOfOrders : 77,
    },
    {
        id : 7,
        image : mozzarellaSticks,
        name : "Mozzarella Sticks",
        numberOfOrders : 73,
    },
    {
        id : 8,
        image : pepperoniPizza,
        name : "Pepperoni Pizza",
        numberOfOrders : 66,
    },
    {
        id : 9,
        image : chickenSandwich,
        name : "Chicken Sandwich",
        numberOfOrders : 60,
    },
    {
        id : 10,
        image : tunaSandwich,
        name : "Tuna Sandwich",
        numberOfOrders : 55,
    },
];

// Table Data
export const tables = [
    {id : 1, name : "Table - 1", status : "Booked", initials : "CY", seats : "6"},
    {id : 2, name : "Table - 2", status : "Available", initials : "MB", seats : "6"},
    {id : 3, name : "Table - 3", status : "Booked", initials : "JS", seats : "6"},
    {id : 4, name : "Table - 4", status : "Booked", initials : "HR", seats : "6"},
    {id : 5, name : "Table - 5", status : "Available", initials : "PL", seats : "6"},
    {id : 6, name : "Table - 6", status : "Booked", initials : "MD", seats : "6"},
    {id : 7, name : "Table - 7", status : "Booked", initials : "RJ", seats : "6"},
    {id : 8, name : "Table - 8", status : "Available", initials : "LC", seats : "6"},
    {id : 9, name : "Table - 9", status : "Booked", initials : "DB", seats : "6"},
    {id : 10, name : "Table - 10", status : "Booked", initials : "KB", seats : "6"},
    {id : 11, name : "Table - 11", status : "Available", initials : "LS", seats : "6"},
    {id : 12, name : "Table - 12", status : "Available", initials : "UI", seats : "6"},
    {id : 13, name : "Table - 13", status : "Booked", initials : "PG", seats : "6"},
    {id : 14, name : "Table - 14", status : "Available", initials : "WC", seats : "6"},
    {id : 15, name : "Table - 15", status : "Booked", initials : "BY", seats : "6"},
    {id : 16, name : "Table - 16", status : "Available", initials : "AE", seats : "6"},
    {id : 17, name : "Table - 17", status : "Booked", initials : "MJ", seats : "6"},
    {id : 18, name : "Table - 18", status : "Booked", initials : "OR", seats : "6"},
    {id : 19, name : "Table - 19", status : "Available", initials : "KC", seats : "6"},
    {id : 20, name : "Table - 20", status : "Available", initials : "HY", seats : "6"},
];

// Menu Category Data
export const burger = [
    {
        id : 1,
        name : "Classic Beef Burger",
        price : "5,500 MMK",
        category : "Burgers",
        image : classicBeefBurger,
    },
    {
        id : 2,
        name : "Cheese Burger",
        price : "6,000 MMK",
        category : "Burgers",
        image : cheeseBurger,
    },
    {
        id : 3,
        name : "Double Beef Burger",
        price : "8,500 MMK",
        category : "Burgers",
        image : doubleBeefBurger,
    },
    {
        id : 4,
        name : "Crispy Chicken Burger",
        price : "5,800 MMK",
        category : "Burgers",
        image : crispyChickenBurger,
    },
    {
        id : 5,
        name : "Spicy Chicken Burger",
        price : "6,000 MMK",
        category : "Burgers",
        image : spicyChickenBurger,
    },
    {
        id : 6,
        name : "BBQ Bacon Burger",
        price : "7,500 MMK",
        category : "Burgers",
        image : bbqBaconBurger,
    },
    {
        id : 7,
        name : "Veggie Burger",
        price : "5,000 MMK",
        category : "Burgers",
        image : veggieBurger,
    },
];

export const quickBites = [
    {
        id : 1,
        name : "Chicken Wrap",
        price : "4,500 MMK",
        category : "Wraps & Quick Bites",
        image : chickenWrap,
    },
    {
        id : 2,
        name : "Spicy Chicken Wrap",
        price : "5,000 MMK",
        category : "Wraps & Quick Bites",
        image : spicyChickenWrap,
    },
    {
        id : 3,
        name : "Beef Wrap",
        price : "5,000 MMK",
        category : "Wraps & Quick Bites",
        image : beefWrap,
    },
    {
        id : 4,
        name : "Hot Dog",
        price : "3,500 MMK",
        category : "Wraps & Quick Bites",
        image : hotDog,
    },
    {
        id : 5,
        name : "Taco",
        price : "4,500 MMK",
        category : "Wraps & Quick Bites",
        image : taco,
    },
];

export const chicken = [
    {
        id : 1,
        name : "1 pc Fried Chicken",
        price : "3,500 MMK",
        category : "Chicken",
        image : singleFriedChicken,
    },
    {
        id : 2,
        name : "2 pc Fried Chicken",
        price : "6,500 MMK",
        category : "Chicken",
        image : doubleFriedChicken,
    },
    {
        id : 3,
        name : "Chicken Wings",
        price : "6,000 MMK",
        category : "Chicken",
        image : chickenWings,
    },
    {
        id : 4,
        name : "Spicy Wings",
        price : "6,500 MMK",
        category : "Chicken",
        image : spicyWings,
    },
    {
        id : 5,
        name : "Chicken Tenders",
        price : "5,500 MMK",
        category : "Chicken",
        image : chickenTenders,
    },
    {
        id : 6,
        name : "Chicken Nuggets",
        price : "4,000 MMK",
        category : "Chicken",
        image : chickenNuggets,
    },
];

export const fries = [
    {
        id : 1,
        name : "French Fries",
        price : "3,000 MMK",
        category : "Fries & Sides",
        image : frenchFries,
    },
    {
        id : 2,
        name : "Cheese Fries",
        price : "3,800 MMK",
        category : "Fries & Sides",
        image : cheeseFries,
    },
    {
        id : 3,
        name : "Curly Fries",
        price : "3,500 MMK",
        category : "Fries & Sides",
        image : curlyFries,
    },
    {
        id : 4,
        name : "Onion Rings",
        price : "3,500 MMK",
        category : "Fries & Sides",
        image : onionRings,
    },
    {
        id : 5,
        name : "Mozzarella Sticks",
        price : "5,500 MMK",
        category : "Fries & Sides",
        image : mozzarellaSticks,
    },
    {
        id : 6,
        name : "Nachos",
        price : "4,000 MMK",
        category : "Fries & Sides",
        image : nachos,
    },
];

export const pizza = [
    {
        id : 1,
        name : "Pepperoni Pizza",
        price : "15,000 MMK",
        category : "Pizza",
        image : pepperoniPizza,
    },
    {
        id : 2,
        name : "Margherita Pizza",
        price : "18,000 MMK",
        category : "Pizza",
        image : margheritaPizza,
    },
    {
        id : 3,
        name : "BBQ Chicken Pizza",
        price : "23,000 MMK",
        category : "Pizza",
        image : bbqChickenPizza,
    },
    {
        id : 4,
        name : "Hawaiian Pizza",
        price : "16,000 MMK",
        category : "Pizza",
        image : hawaiianPizza,
    },
    {
        id : 5,
        name : "Veggie Pizza",
        price : "12,500 MMK",
        category : "Pizza",
        image : veggiePizza,
    },
];

export const sandwiches = [
    {
        id : 1,
        name : "Chicken Sandwich",
        price : "5,000 MMK",
        category : "Sandwiches",
        image : chickenSandwich,
    },
    {
        id : 2,
        name : "Club Sandwich",
        price : "5,500 MMK",
        category : "Sandwiches",
        image : clubSandwich,
    },
    {
        id : 3,
        name : "Tuna Sandwich",
        price : "5,500 MMK",
        category : "Sandwiches",
        image : tunaSandwich,
    },
    {
        id : 4,
        name : "Egg Mayo Sandwich",
        price : "4,500 MMK",
        category : "Sandwiches",
        image : eggMayoSandwich,
    },
];

export const drinks = [
    {
        id : 1,
        name : "Coca Cola",
        price : "2,000 MMK",
        category : "Drinks",
        image : cocaCola,
    },
    {
        id : 2,
        name : "Boba Tea",
        price : "7,500 MMK",
        category : "Drinks",
        image : bobaTea,
    },
    {
        id : 3,
        name : "Lemon Iced Tea",
        price : "4,000 MMK",
        category : "Drinks",
        image : lemonIcedTea,
    },
    {
        id : 4,
        name : "Milkshake",
        price : "5,500 MMK",
        category : "Drinks",
        image : milkShake,
    },
    {
        id : 5,
        name : "Pepsi",
        price : "2,800 MMK",
        category : "Drinks",
        image : pepsi,
    },
    {
        id : 6,
        name : "Sprite",
        price : "2,000 MMK",
        category : "Drinks",
        image : sprite,
    },
];

export const desserts = [
    {
        id : 1,
        name : "Brownie",
        price : "3,000 MMK",
        category : "Desserts",
        image : brownie,
    },
    {
        id : 2,
        name : "Falooda",
        price : "6,500 MMK",
        category : "Desserts",
        image : falooda,
    },
    {
        id : 3,
        name : "Fruit Salad",
        price : "7,000 MMK",
        category : "Desserts",
        image : fruitSalad,
    },
    {
        id : 4,
        name : "Mini Donuts",
        price : "4,000 MMK",
        category : "Desserts",
        image : miniDonuts,
    },
    {
        id : 5,
        name : "Sundae Ice Ceam",
        price : "5,500 MMK",
        category : "Desserts",
        image : sundaeIceCream,
    },
];

export const menus = [
    {id : 1, name : "Burgers", bgColor: "#F4B400", icon: "🍔", items : burger},
    {id : 2, name : "Wraps & Quick Bites", bgColor: "#7ED957", icon: "🌯", items : quickBites},
    {id : 3, name : "Chicken", bgColor: "#FF8A3D", icon: "🍗", items : chicken},
    {id : 4, name : "Fries & Sides", bgColor: "#FF5A5F", icon: "🍟", items : fries},
    {id : 5, name : "Pizza", bgColor: "#FF7043", icon: "🍕", items : pizza},
    {id : 6, name : "Sandwiches", bgColor: "#C58B4E", icon: "🥪", items : sandwiches},
    {id : 7, name : "Drinks", bgColor: "#3B82F6", icon: "🥤", items : drinks},
    {id : 8, name : "Desserts", bgColor: "#C084FC", icon: "🍦", items : desserts},
]