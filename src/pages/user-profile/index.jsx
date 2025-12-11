import React from "react";

const index = () => {
  let options = [
    { key: "dashboard", description: "Overview of your account, stats and recent activity" },
    { key: "messages", description: "Your inbox for conversations and notifications" },
    { key: "my profile", description: "View and edit your personal information" },
    { key: "my listings", description: "Items or services you have listed" },
    { key: "favorites", description: "Items you have favorited or saved" },
    { key: "settings", description: "Account and application preferences" },
    { key: "logout", description: "Sign out of your account" }
  ];

  return (
    <div style={{color:'white' , padding:'20px' , display:'flex' , flexDirection:'column' , gap:'20px' , maxWidth:'400px' , margin:'auto' , border:'2px solid gray' , borderRadius:'10px' , backgroundColor:'#1e1e1e' }}>
      <div style={{display:'flex' , justifyContent:'flexstart' , alignItems:'center' , gap:'20px' }}>
        <div style={{border:'2px solid white' , borderRadius:"50px", height:'100px', width:"100px"}}>
        {/* <img src="logo.png" alt="Logo" /> */}
        </div>
        <div style={{display:'flex' , justifyContent:'center' , alignItems:'center' , flexDirection:'column'}}>
            <p>Name:</p>
            <p>Email:abc@gmail.com</p>
        </div>
      </div>

      <div>
      {options.map((option) => (
        <div key={option.key} style={{padding:'10px', borderBottom:'1px solid gray'}}>
          <h3 style={{textTransform:'capitalize' , fontWeight:'bold'}}>{option.key}</h3>
          <p style={{fontSize:'12px' , color:'gray'}}>{option.description}</p>
        </div>
      ))}
      </div>
    </div>
  );
};

export default index;
