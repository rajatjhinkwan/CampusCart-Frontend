import React from 'react'

const Card = ({item}) => {
  const CardStyle = {
    border: "3px solid black",
    borderRadius: "15px",
    padding: "10px",
    margin: "10px",
    width: "300px",
    height:"360px",
  };

  return (
    <div style={CardStyle}>
      <img src={item.img} alt="NO IMAGE" style={{height:'220px', width:'300px', border:'2px solid green', borderRadius:'15px'}}/>
      <div style={{margin:'2px 5px'}}>
        <p style={{fontWeight:'bold' , fontSize:'24px'}}>PRICE : {item.price}</p>
        <p style={{color:'grey', fontWeight:'bold'}}>{item.title}</p>
        <p>{item.description}</p>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center' , flexDirection:'row'}}>
            <p>{item.location}</p>
            <p>{item.owner}</p>
        </div>
      </div>
    </div>
  );
}

export default Card
