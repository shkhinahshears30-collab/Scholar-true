
import React from 'react';
import { 
  Sprout, Cat, Cpu, Flame, Bird, Ghost, Dog, Fish, Rabbit, Mouse, Turtle, Bug,
  Glasses, GraduationCap, HardHat, Heart, Star, Sparkles, PartyPopper, Briefcase,
  Zap, Shield, Dumbbell, Target, Skull, Mic, Wind, Smile, Atom, Sword, Users,
  ZapOff, Cloud, Sun, Moon, Waves, Shirt, UserCheck, Rocket, Crown, Wand2,
  Anchor, Battery, Biohazard, Box, Coffee, Compass, Gem, Gift, Hammer, Key, 
  Map, Music, Palette, PenTool, Radio, Rocket as RocketIcon, Scissors, Speaker, 
  Stethoscope, Trophy, Umbrella, Watch, Eye, Zap as Bolt,
  Squirrel, TreePine, PawPrint, Landmark, Mountain, Tent, TreePalm,
  FishSymbol, Shell, Waves as WavesIcon, Anchor as AnchorIcon,
  MoonStar, Orbit, Telescope, CheckCircle2, 
  Dna, Microscope, FlaskConical, 
  Sword as SwordIcon, ShieldAlert,
  Cookie, Pizza, IceCream, Apple, Cherry, 
  Snowflake, Zap as Thunder, 
  Plane, Car, Bike, Train,
  Library, TreeDeciduous, TentTree, Warehouse, Construction, LandPlot, Sofa, Coffee as CoffeeIcon
} from 'lucide-react';
import { CompanionType, SponsorOffer } from './types';

export const STORAGE_KEY = 'scholar_user_data';

export const BASE_COMPANIONS = [
  { type: 'sprout', name: 'Leafy', icon: <Sprout size={48} />, color: 'text-emerald-400', bg: 'bg-emerald-50', isPremium: false },
  { type: 'kitten', name: 'Mochi', icon: <Cat size={48} />, color: 'text-orange-300', bg: 'bg-orange-50', isPremium: false },
  { type: 'robot', name: 'Sparky', icon: <Cpu size={48} />, color: 'text-blue-400', bg: 'bg-blue-50', isPremium: false },
  { type: 'dragon', name: 'Draco', icon: <Flame size={48} />, color: 'text-red-400', bg: 'bg-red-50', isPremium: false },
  { type: 'phoenix', name: 'Nova', icon: <Bird size={48} />, color: 'text-amber-400', bg: 'bg-amber-50', isPremium: false },
];

export const MARVEL_COMPANIONS = [
  { type: 'ironman', name: 'Iron Man', icon: <Zap size={48} />, color: 'text-red-500', bg: 'bg-red-50', isPremium: true },
  { type: 'spiderman', name: 'Spiderman', icon: <Bug size={48} />, color: 'text-blue-600', bg: 'bg-blue-50', isPremium: true },
  { type: 'hulk', name: 'The Hulk', icon: <Dumbbell size={48} />, color: 'text-green-600', bg: 'bg-green-50', isPremium: true },
  { type: 'cap', name: 'Captain America', icon: <Shield size={48} />, color: 'text-blue-400', bg: 'bg-blue-50', isPremium: true },
  { type: 'panther', name: 'Black Panther', icon: <Cat size={48} />, color: 'text-slate-900', bg: 'bg-slate-200', isPremium: true },
  { type: 'thor', name: 'Thor', icon: <Hammer size={48} />, color: 'text-blue-300', bg: 'bg-blue-100', isPremium: true },
  { type: 'strange', name: 'Dr. Strange', icon: <Sparkles size={48} />, color: 'text-red-700', bg: 'bg-red-100', isPremium: true },
  { type: 'wolverine', name: 'Wolverine', icon: <Scissors size={48} />, color: 'text-yellow-500', bg: 'bg-yellow-50', isPremium: true },
  { type: 'widow', name: 'Black Widow', icon: <Target size={48} />, color: 'text-slate-800', bg: 'bg-slate-100', isPremium: true },
  { type: 'scarlet', name: 'Wanda', icon: <Moon size={48} />, color: 'text-red-600', bg: 'bg-red-50', isPremium: true },
  { type: 'vision', name: 'Vision', icon: <Cpu size={48} />, color: 'text-purple-500', bg: 'bg-purple-50', isPremium: true },
  { type: 'groot', name: 'Groot', icon: <Sprout size={48} />, color: 'text-amber-700', bg: 'bg-amber-50', isPremium: true },
  { type: 'rocket_raccoon', name: 'Rocket', icon: <RocketIcon size={48} />, color: 'text-slate-600', bg: 'bg-slate-100', isPremium: true },
];

export const ANIME_COMPANIONS = [
  { type: 'naruto', name: 'Naruto', icon: <Wind size={48} />, color: 'text-orange-500', bg: 'bg-orange-50', isPremium: true },
  { type: 'goku', name: 'Goku', icon: <Bolt size={48} />, color: 'text-yellow-400', bg: 'bg-yellow-50', isPremium: true },
  { type: 'luffy', name: 'Luffy', icon: <Smile size={48} />, color: 'text-red-500', bg: 'bg-red-50', isPremium: true },
  { type: 'tanjiro', name: 'Tanjiro', icon: <Waves size={48} />, color: 'text-emerald-500', bg: 'bg-emerald-50', isPremium: true },
  { type: 'gojo', name: 'Satoru Gojo', icon: <ZapOff size={48} />, color: 'text-blue-500', bg: 'bg-blue-50', isPremium: true },
];

export const STRANGER_THINGS_COMPANIONS = [
  { type: 'eleven', name: 'Eleven', icon: <Zap size={48} />, color: 'text-indigo-500', bg: 'bg-indigo-50', isPremium: true },
  { type: 'dustin', name: 'Dustin', icon: <Radio size={48} />, color: 'text-blue-500', bg: 'bg-blue-50', isPremium: true },
];

export const FARM_FRIENDS = [
  { type: 'dog', name: 'Buddy', icon: <Dog size={48} />, color: 'text-amber-600', bg: 'bg-amber-50', isPremium: false },
  { type: 'bunny', name: 'Hops', icon: <Rabbit size={48} />, color: 'text-slate-400', bg: 'bg-slate-50', isPremium: false },
  { type: 'hamster', name: 'Cheeks', icon: <Mouse size={48} />, color: 'text-orange-400', bg: 'bg-orange-50', isPremium: false },
  { type: 'turtle', name: 'Shelly', icon: <Turtle size={48} />, color: 'text-emerald-600', bg: 'bg-emerald-50', isPremium: true },
  { type: 'sheep', name: 'Wooly', icon: <Cloud size={48} />, color: 'text-slate-300', bg: 'bg-slate-50', isPremium: true },
  { type: 'pig', name: 'Oink', icon: <Heart size={48} />, color: 'text-pink-400', bg: 'bg-pink-50', isPremium: true },
  { type: 'owl', name: 'Hoot', icon: <Eye size={48} />, color: 'text-amber-900', bg: 'bg-amber-50', isPremium: true },
  { type: 'fox', name: 'Rusty', icon: <PawPrint size={48} />, color: 'text-orange-600', bg: 'bg-orange-50', isPremium: true },
  { type: 'squirrel', name: 'Nutty', icon: <Squirrel size={48} />, color: 'text-amber-800', bg: 'bg-amber-50', isPremium: true },
  { type: 'hedgehog', name: 'Spike', icon: <Bug size={48} />, color: 'text-slate-500', bg: 'bg-slate-100', isPremium: true },
];

export const JUNGLE_ROYALTY = [
  { type: 'lion', name: 'Leo', icon: <Crown size={48} />, color: 'text-amber-500', bg: 'bg-amber-50', isPremium: true },
  { type: 'tiger', name: 'Khan', icon: <Flame size={48} />, color: 'text-orange-600', bg: 'bg-orange-50', isPremium: true },
  { type: 'panda', name: 'Bao', icon: <CheckCircle2 size={48} />, color: 'text-slate-900', bg: 'bg-slate-100', isPremium: true },
  { type: 'monkey', name: 'Momo', icon: <Smile size={48} />, color: 'text-amber-700', bg: 'bg-amber-50', isPremium: true },
  { type: 'elephant', name: 'Trunk', icon: <WavesIcon size={48} />, color: 'text-slate-400', bg: 'bg-slate-100', isPremium: true },
  { type: 'parrot', name: 'Poly', icon: <Bird size={48} />, color: 'text-emerald-500', bg: 'bg-emerald-50', isPremium: true },
  { type: 'snake', name: 'Slither', icon: <Wind size={48} />, color: 'text-green-700', bg: 'bg-green-50', isPremium: true },
  { type: 'gorilla', name: 'Kong', icon: <Dumbbell size={48} />, color: 'text-slate-800', bg: 'bg-slate-200', isPremium: true },
  { type: 'zebra', name: 'Stripes', icon: <Box size={48} />, color: 'text-slate-700', bg: 'bg-slate-50', isPremium: true },
  { type: 'giraffe', name: 'Tallie', icon: <Sun size={48} />, color: 'text-yellow-500', bg: 'bg-yellow-50', isPremium: true },
  { type: 'palm', name: 'Palmy', icon: <TreePalm size={48} />, color: 'text-emerald-400', bg: 'bg-emerald-50', isPremium: true },
  { type: 'koala', name: 'Koda', icon: <Heart size={48} />, color: 'text-slate-400', bg: 'bg-slate-50', isPremium: true },
];

export const DEEP_SEA = [
  { type: 'shark', name: 'Bruce', icon: <Zap size={48} />, color: 'text-blue-700', bg: 'bg-blue-50', isPremium: true },
  { type: 'whale', name: 'Willy', icon: <WavesIcon size={48} />, color: 'text-blue-400', bg: 'bg-blue-50', isPremium: true },
  { type: 'dolphin', name: 'Echo', icon: <Wind size={48} />, color: 'text-sky-400', bg: 'bg-sky-50', isPremium: true },
  { type: 'octopus', name: 'Inky', icon: <Ghost size={48} />, color: 'text-purple-500', bg: 'bg-purple-50', isPremium: true },
  { type: 'crab', name: 'Sebastian', icon: <Gem size={48} />, color: 'text-rose-500', bg: 'bg-rose-50', isPremium: true },
  { type: 'fish', name: 'Goldie', icon: <Fish size={48} />, color: 'text-orange-400', bg: 'bg-orange-50', isPremium: false },
  { type: 'turtle_sea', name: 'Crush', icon: <AnchorIcon size={48} />, color: 'text-emerald-500', bg: 'bg-emerald-50', isPremium: true },
  { type: 'shell', name: 'Pearl', icon: <Shell size={48} />, color: 'text-pink-300', bg: 'bg-pink-50', isPremium: true },
  { type: 'tropical', name: 'Nemo', icon: <FishSymbol size={48} />, color: 'text-orange-500', bg: 'bg-orange-50', isPremium: true },
  { type: 'seahorse', name: 'Bubbles', icon: <Sparkles size={48} />, color: 'text-indigo-400', bg: 'bg-indigo-50', isPremium: true },
];

export const COSMIC_VOYAGERS = [
  { type: 'rocket', name: 'Apollo', icon: <Rocket size={48} />, color: 'text-indigo-500', bg: 'bg-indigo-50', isPremium: true },
  { type: 'ufo', name: 'Ziggy', icon: <Radio size={48} />, color: 'text-emerald-400', bg: 'bg-emerald-50', isPremium: true },
  { type: 'alien', name: 'Zorp', icon: <Ghost size={48} />, color: 'text-lime-400', bg: 'bg-lime-50', isPremium: true },
  { type: 'starman', name: 'Major Tom', icon: <Star size={48} />, color: 'text-yellow-400', bg: 'bg-yellow-50', isPremium: true },
  { type: 'moon', name: 'Luna', icon: <Moon size={48} />, color: 'text-slate-300', bg: 'bg-slate-50', isPremium: true },
  { type: 'sun', name: 'Sol', icon: <Sun size={48} />, color: 'text-orange-400', bg: 'bg-orange-50', isPremium: true },
  { type: 'galaxy', name: 'Andromeda', icon: <Orbit size={48} />, color: 'text-purple-600', bg: 'bg-purple-50', isPremium: true },
  { type: 'comet', name: 'Halley', icon: <Sparkles size={48} />, color: 'text-sky-300', bg: 'bg-sky-50', isPremium: true },
  { type: 'saturn', name: 'Ringo', icon: <Orbit size={48} />, color: 'text-amber-600', bg: 'bg-amber-50', isPremium: true },
  { type: 'telescope', name: 'Hubble', icon: <Telescope size={48} />, color: 'text-slate-600', bg: 'bg-slate-100', isPremium: true },
];

export const MYTHIC_BEASTS = [
  { type: 'unicorn', name: 'Sparkle', icon: <Heart size={48} />, color: 'text-pink-400', bg: 'bg-pink-50', isPremium: true },
  { type: 'griffin', name: 'Griff', icon: <Bird size={48} />, color: 'text-amber-600', bg: 'bg-amber-50', isPremium: true },
  { type: 'hydra', name: 'Hydra', icon: <Biohazard size={48} />, color: 'text-green-600', bg: 'bg-green-50', isPremium: true },
  { type: 'kraken', name: 'Kraken', icon: <WavesIcon size={48} />, color: 'text-indigo-800', bg: 'bg-indigo-50', isPremium: true },
  { type: 'fairy', name: 'Tink', icon: <Sparkles size={48} />, color: 'text-yellow-300', bg: 'bg-yellow-50', isPremium: true },
  { type: 'ghost', name: 'Casper', icon: <Ghost size={48} />, color: 'text-slate-200', bg: 'bg-slate-50', isPremium: false },
  { type: 'wizard', name: 'Merlin', icon: <Wand2 size={48} />, color: 'text-purple-500', bg: 'bg-purple-50', isPremium: true },
  { type: 'knight', name: 'Arthur', icon: <ShieldAlert size={48} />, color: 'text-slate-600', bg: 'bg-slate-100', isPremium: true },
  { type: 'castle', name: 'Camelot', icon: <Landmark size={48} />, color: 'text-amber-800', bg: 'bg-amber-50', isPremium: true },
  { type: 'potion', name: 'Elixir', icon: <FlaskConical size={48} />, color: 'text-rose-500', bg: 'bg-rose-50', isPremium: true },
];

export const PREHISTORIC_PALS = [
  { type: 't-rex', name: 'Rexy', icon: <Skull size={48} />, color: 'text-rose-600', bg: 'bg-rose-50', isPremium: true },
  { type: 'stego', name: 'Spike', icon: <Mountain size={48} />, color: 'text-emerald-700', bg: 'bg-emerald-50', isPremium: true },
  { type: 'pterodactyl', name: 'Sky', icon: <Bird size={48} />, color: 'text-sky-500', bg: 'bg-sky-50', isPremium: true },
  { type: 'bronto', name: 'Neck', icon: <Cloud size={48} />, color: 'text-slate-400', bg: 'bg-slate-100', isPremium: true },
  { type: 'dino_egg', name: 'Yoshi', icon: <CheckCircle2 size={48} />, color: 'text-green-400', bg: 'bg-green-50', isPremium: true },
  { type: 'volcano', name: 'Magma', icon: <Flame size={48} />, color: 'text-orange-600', bg: 'bg-orange-50', isPremium: true },
  { type: 'caveman', name: 'Oog', icon: <Users size={48} />, color: 'text-amber-900', bg: 'bg-amber-50', isPremium: true },
  { type: 'mammoth', name: 'Manny', icon: <Wind size={48} />, color: 'text-slate-300', bg: 'bg-slate-50', isPremium: true },
  { type: 'fossile', name: 'Bones', icon: <Dna size={48} />, color: 'text-slate-500', bg: 'bg-slate-100', isPremium: true },
  { type: 'amber', name: 'Glow', icon: <Gem size={48} />, color: 'text-amber-500', bg: 'bg-amber-50', isPremium: true },
];

export const FOODIE_PETS = [
  { type: 'pizza', name: 'Pepperoni', icon: <Pizza size={48} />, color: 'text-orange-500', bg: 'bg-orange-50', isPremium: true },
  { type: 'burger', name: 'Patty', icon: <Briefcase size={48} />, color: 'text-amber-800', bg: 'bg-amber-50', isPremium: true },
  { type: 'ice_cream', name: 'Scoopy', icon: <IceCream size={48} />, color: 'text-pink-400', bg: 'bg-pink-50', isPremium: true },
  { type: 'cookie', name: 'Chip', icon: <Cookie size={48} />, color: 'text-amber-600', bg: 'bg-amber-50', isPremium: true },
  { type: 'apple', name: 'Crispy', icon: <Apple size={48} />, color: 'text-red-500', bg: 'bg-red-50', isPremium: true },
  { type: 'cherry', name: 'Twins', icon: <Cherry size={48} />, color: 'text-rose-600', bg: 'bg-rose-50', isPremium: true },
  { type: 'coffee_pet', name: 'Java', icon: <Coffee size={48} />, color: 'text-amber-950', bg: 'bg-amber-100', isPremium: true },
  { type: 'donut', name: 'Dottie', icon: <Target size={48} />, color: 'text-purple-400', bg: 'bg-purple-50', isPremium: true },
  { type: 'watermelon', name: 'Melon', icon: <CheckCircle2 size={48} />, color: 'text-green-500', bg: 'bg-green-50', isPremium: true },
];

export const ALL_COMPANIONS = [
  ...BASE_COMPANIONS, 
  ...MARVEL_COMPANIONS, 
  ...ANIME_COMPANIONS,
  ...STRANGER_THINGS_COMPANIONS,
  ...FARM_FRIENDS,
  ...JUNGLE_ROYALTY,
  ...DEEP_SEA,
  ...COSMIC_VOYAGERS,
  ...MYTHIC_BEASTS,
  ...PREHISTORIC_PALS,
  ...FOODIE_PETS
];

export const HABITATS = [
  { id: 'default', name: 'Cozy Library', icon: <Library size={24} />, colors: 'from-indigo-600 via-indigo-500 to-indigo-400' },
  { id: 'forest', name: 'Zen Forest', icon: <TreeDeciduous size={24} />, colors: 'from-emerald-700 via-emerald-600 to-emerald-400' },
  { id: 'camp', name: 'Study Camp', icon: <TentTree size={24} />, colors: 'from-amber-600 via-amber-500 to-orange-400' },
  { id: 'station', name: 'Space Hub', icon: <Orbit size={24} />, colors: 'from-slate-900 via-purple-900 to-slate-900' },
  { id: 'volcano', name: 'Magma Peak', icon: <Flame size={24} />, colors: 'from-red-900 via-orange-800 to-red-800' },
  { id: 'city', name: 'Skyline Lab', icon: <LandPlot size={24} />, colors: 'from-blue-900 via-slate-800 to-blue-800' },
  { id: 'lounge', name: 'Focus Lounge', icon: <Sofa size={24} />, colors: 'from-purple-800 via-indigo-900 to-purple-900' },
  { id: 'cafe', name: 'Scholar Cafe', icon: <CoffeeIcon size={24} />, colors: 'from-amber-900 via-amber-800 to-stone-700' },
];

export const PET_FOOD = [
  { id: 'berry', name: 'Brain Berry', icon: <Apple size={20} className="text-rose-400" />, growth: 1 },
  { id: 'snack', name: 'Logic Loaf', icon: <Cookie size={20} className="text-amber-600" />, growth: 2 },
  { id: 'potion', name: 'Focus Fuel', icon: <FlaskConical size={20} className="text-indigo-400" />, growth: 5 },
  { id: 'steak', name: 'Scholar Steak', icon: <Zap size={20} className="text-red-400" />, growth: 10 },
];

export const ACCESSORIES = [
  { id: 'none', name: 'Clean Look', icon: <div className="w-5 h-5 border-2 border-dashed border-slate-300 rounded-full" /> },
  { id: 'tuxedo', name: 'Business Suit', icon: <Shirt size={20} className="text-slate-900" /> },
  { id: 'iron_suit', name: 'Mark IV Armor', icon: <Zap size={20} className="text-red-600" /> },
  { id: 'web_suit', name: 'Spider Suit', icon: <Bug size={20} className="text-blue-500" /> },
  { id: 'vibranium', name: 'Vibranium Suit', icon: <Cat size={20} className="text-slate-800" /> },
  { id: 'glasses', name: 'Study Glasses', icon: <Glasses size={20} /> },
  { id: 'grad_cap', name: 'Scholar Cap', icon: <GraduationCap size={20} /> },
];

export const DISTRACTING_APPS = [
  'TikTok', 'Instagram', 'YouTube', 'Facebook', 'Discord', 'Netflix', 'Snapchat', 'Reddit', 'Twitter (X)', 'Pinterest'
];

export const SPONSOR_OFFERS: SponsorOffer[] = [
  { id: '1', name: 'Khan Academy Extra', discount: '15% Off Premium', image: 'https://picsum.photos/seed/khan/200/100', link: '#' },
  { id: '2', name: 'Brilliant.org', discount: '1 Month Free Trial', image: 'https://picsum.photos/seed/brilliant/200/100', link: '#' },
  { id: '3', name: 'Coursera+ for Uni', discount: '20% Off Plus', image: 'https://picsum.photos/seed/coursera/200/100', link: '#' }
];

export const MAX_TIME_FREE = 60;
export const MAX_TIME_PREMIUM = 120;

export const PREMIUM_PLANS = [
  { id: 'weekly', label: 'Weekly Access', usd: '$1.99', eur: '€1.79', billing: 'per week' },
  { id: 'monthly', label: 'Monthly Elite', usd: '$4.99', eur: '€4.49', billing: 'per month', popular: true },
  { id: 'yearly', label: 'Annual Ultra', usd: '$69.99', eur: '€34.99', billing: 'per year', savings: 'Save over 50%' },
];

export const LANG_OPTIONS = [
  { id: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { id: 'es-es', name: 'Spanish (Spain)', native: 'Español (España)', flag: '🇪🇸' },
  { id: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { id: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { id: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { id: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { id: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { id: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
];

function Triangle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    </svg>
  );
}
