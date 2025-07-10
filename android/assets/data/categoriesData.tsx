import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

const categoriesData = [
    {
      id: '1', 
      name: 'Work',
      color: '#f87171',
      Icon: <Ionicons name="briefcase" size={20} color="#FFFFFF" />,
      AddCategories: <Ionicons name="add" size={20} color="#333333" />,
      
    },
    {
      id: '2',
      name: 'Personal',
      color:'#8b5cf6',
      Icon: <Ionicons name="person" size={25} color="#FFFFFF" />,
      AddCategories: <Ionicons name="add" size={20} color="#333333" />
     
    },
    {
      id: '3', 
      name: 'Study',
      color: '#a80e54',
      Icon: <Ionicons name="book" size={20} color="#FFFFFF" />,
      AddCategories: <Ionicons name="add" size={20} color="#333333" />
    },
   

  ];
  
  export default categoriesData;