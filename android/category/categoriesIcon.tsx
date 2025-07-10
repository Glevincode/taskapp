
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";          // Import library Area
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";



 // Rendercategory Icons
const renderCategoryIcon = (
  iconName: string,
  lib: 'Ionicons' | 'Feather' | 'FontAwesome'  | 'MaterialIcons',
  size: number = 28,
  color: string = '#6C63FF'
) => {
  switch (lib) {
    case 'Ionicons':
      return <Ionicons name={iconName} size={size} color={color} />;
    case 'Feather':
      return <Feather name={iconName} size={size} color={color} />;
       case 'FontAwesome':
      return <FontAwesome name={iconName} size={size} color={color} />;
        case 'MaterialIcons':
      return <MaterialIcons name={iconName} size={size} color={color} />;
    default:
      return null;
  }
};


const categoriesIcons = [
  { title: 'Code',
     name: 'code-slash',
      lib: 'Ionicons' 
    },
  { title: 'Shopping', name: 'cart', lib: 'Ionicons' },
  { title: 'Cooking', name: 'restaurant-outline', lib: 'Ionicons' },
  { title: 'Gaming', name: 'game-controller-outline', lib: 'Ionicons' },
  { title: 'Gardening', name: 'flower-outline', lib: 'Ionicons' },
  { title: 'Movie Time', name: 'film-outline', lib: 'Ionicons' },
  { title: 'Fitness', name: 'barbell-outline', lib: 'Ionicons' },
  { title: 'Travel', name: 'airplane-outline', lib: 'Ionicons' },
  { title: 'Health', name: 'medkit-outline', lib: 'Ionicons' },
  { title: 'Music', name: 'musical-notes-outline', lib: 'Ionicons' },
  { title: 'Event', name: 'calendar-outline', lib: 'Ionicons' },
  { title: 'Reminder', name: 'notifications-outline', lib: 'Ionicons' },
  { title: 'Ongoing', name: 'hourglass-outline', lib: 'Ionicons' },
  { title: 'Assignment', name: 'document-text-outline', lib: 'Ionicons' },
  { title: 'Category', name: 'folder-outline', lib: 'Ionicons' },
  { title: 'Hiking', name: 'walk-outline', lib: 'Ionicons' },
  { title: 'Painting', name: 'color-palette-outline', lib: 'Ionicons' },
  { title: 'Pets', name: 'paw-outline', lib: 'Ionicons' },
  { title: 'Writing', name: 'pencil-outline', lib: 'Ionicons' },
  { title: 'Art', name: 'color-fill-outline', lib: 'Ionicons' },
  { title: 'Bike', name: 'bicycle-outline', lib: 'Ionicons' },
  { title: 'Swim', name: 'water-outline', lib: 'Ionicons' },
  { title: 'Adventure', name: 'compass-outline', lib: 'Ionicons' },
  { title: 'Relax', name: 'cafe-outline', lib: 'Ionicons' },
  { title: 'Sports Fan', name: 'trophy-outline', lib: 'Ionicons' },
  { title: 'Journal Writing', name: 'book-outline', lib: 'Ionicons' },
  { title: 'Astronomy', name: 'moon-outline', lib: 'Ionicons' },
  { title: 'Fashion', name: 'cut-outline', lib: 'Ionicons' },
  { title: 'Camping', name: 'bonfire-outline', lib: 'Ionicons' },
  { title: 'Horse Riding', name: 'leaf-outline', lib: 'Ionicons' },
  { title: 'Music Practice', name: 'musical-note-outline', lib: 'Ionicons' },
  { title: 'Baking', name: 'ice-cream-outline', lib: 'Ionicons' },
  { title: 'Collecting', name: 'albums-outline', lib: 'Ionicons' },
  { title: 'Yoga', name: 'accessibility-outline', lib: 'Ionicons' },
  { title: 'Fishing', name: 'fish-outline', lib: 'Ionicons' },
  { title: 'Language Study', name: 'globe-outline', lib: 'Ionicons' },
  { title: 'Volunteering', name: 'hand-left-outline', lib: 'Ionicons' },
  
  { title: 'DIY Projects', name: 'construct-outline', lib: 'Ionicons' },
  { title: 'Family Time', name: 'people-outline', lib: 'Ionicons' },
  { title: 'Karaoke', name: 'mic-outline', lib: 'Ionicons' },
  { title: 'Pet Walking', name: 'paw-outline', lib: 'Ionicons' },
  { title: 'Online Class', name: 'laptop-outline', lib: 'Ionicons' },
  { title: 'Interview Prep', name: 'person-outline', lib: 'Ionicons' },
  { title: 'Business Trip', name: 'airplane-outline', lib: 'Ionicons' },
  { title: 'Research', name: 'search-outline', lib: 'Ionicons' },
  { title: 'Remote Work', name: 'home-outline', lib: 'Ionicons' },
  { title: 'Design Work', name: 'color-wand-outline', lib: 'Ionicons' },

  { title: 'Project', name: 'layers-outline', lib: 'Ionicons' },
  { title: 'Networking', name: 'git-network-outline', lib: 'Ionicons' },
  { title: 'Marketing', name: 'megaphone-outline', lib: 'Ionicons' },
  { title: 'Idea', name: 'bulb-outline', lib: 'Ionicons' },
  { title: 'Work', name: 'briefcase-outline', lib: 'Ionicons' },
  { title: 'Personal', name: 'person-outline', lib: 'Ionicons' },
  { title: 'Reading', name: 'book-outline', lib: 'Ionicons' },
  { title: 'JavaScript', name: 'logo-javascript', lib: 'Ionicons' },
{ title: 'Python', name: 'terminal-outline', lib: 'Ionicons' },
{ title: 'React', name: 'logo-react', lib: 'Ionicons' },
{ title: 'Java', name: 'cafe-outline', lib: 'Ionicons' },

];
export default categoriesIcons;
