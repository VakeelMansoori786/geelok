var express = require('express');
var app = express();
var mysql = require('mysql');
let config = require('./config');
let smsConfig = require('./Integration/sms');
var bodyParser = require('body-parser');
var multer = require('multer');
const path = require("path");
var axios = require('axios')
const fs = require("fs");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
const request = require('request');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));
app.use(express.static('uploads'));
//app.use(subdomain('uploads', express.static('uploads')));
app.use('/uploads', express.static(process.cwd() + '/uploads'))
const apiKey = config.sms.smsApiKey;
const apiSecret = config.sms.smsSecretKey;
var smsglobal = require('smsglobal')(apiKey, apiSecret);
let uploadfilename=''
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads');
   },
   filename: function (req, file, cb) {
    uploadfilename=Date.now() + '-' + file.originalname;
      cb(null,uploadfilename);
      
   }
});
var upload = multer({ storage: storage });
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * Create New Item
 *
 * @return response()
 */
app.post('/api/image-upload', upload.single('file'),(req, res) => {
  
  return res.send(JSON.stringify({"response": uploadfilename}));

});


app.get('/api/image/:p_image', async function (req, res) {
  if (fs.existsSync(process.cwd()+`/uploads/${req.params.p_image}`)) {
  fs.readFile(
    process.cwd()+`/uploads/${req.params.p_image}`,

    function (err, image) {
        if (err) {
            throw err;
        }
       
        res.setHeader('Content-Type', 'image/jpg');
        res.setHeader('Content-Length', ''); // Image size here
        res.setHeader('Access-Control-Allow-Origin', '*'); // If needs to be public
        res.send(image);
    }
);
  }
  else{
    res.send('');
  }
})
let connection = mysql.createPool(config.connectionStrings);
app.get('/', async function (req, res) {
  await res.send(getAuthToken());
})




//#region Location API

app.get('/api/Location/GetLocation',  async function (req, res) {
  await connection.query('SELECT * FROM `locations`', function (error, results, fields) {
     if (error) return res.send(error);
     return res.send(results);
     });
  
 })
//#endregion

//#region Location API

app.get('/api/Location/GetLocationImage/:location_id',  async function (req, res) {
  let location_id = req.params.location_id;
  await connection.query('SELECT * FROM `locations_images` where  `location_id`='+location_id, function (error, results, fields) {
     if (error) return res.send(error);
     return res.send(results);
     });
 })
//#endregion
 //#region Category API
app.get('/api/global/GetBrand',  async function (req, res) {
 await connection.query('SELECT * FROM `brand`', function (error, results, fields) {

    if (error) return res.send(error);
    return res.send(results);
    });
 
})
app.post('/api/global/SaveBrand',  async function (req, res) {
  
  let p_brand_id = req.body.p_brand_id;
  let p_name = req.body.p_name;
  let p_create_by = req.body.p_create_by;
  await connection.query("call pr_save_brand(?,?,?)", [p_brand_id, p_name,p_create_by], function (error, results, fields) {
   
     if (error) return res.send(error);
     return res.send(results[0]);
     });
  
 })

 app.get('/api/global/GetCountry',  async function (req, res) {
  await connection.query('SELECT * FROM `country`', function (error, results, fields) {
 
     if (error) return res.send(error);
     return res.send(results);
     });
  
 })
 app.post('/api/global/SaveCountry',  async function (req, res) {
   
   let p_country_id = req.body.p_country_id;
   let p_name = req.body.p_name;
   let p_tax_percent = req.body.p_tax_percent;
   let p_create_by = req.body.p_create_by;
   await connection.query("call pr_save_country(?,?,?,?)", [p_country_id, p_name,p_tax_percent,p_create_by], function (error, results, fields) {
    
      if (error) return res.send(error);
      return res.send(results[0]);
      });
   
  })


  app.get('/api/global/GetCompany',  async function (req, res) {
    await connection.query('SELECT * FROM `Company`', function (error, results, fields) {
   
       if (error) return res.send(error);
       return res.send(results);
       });
    
   })
   app.post('/api/global/SaveCompany',  async function (req, res) {
     
     let p_company_id = req.body.p_company_id;
     let p_company_name = req.body.p_company_name;
     let p_company_short_name = req.body.p_company_short_name;
     let p_company_ar_name = req.body.p_company_ar_name;
     let p_company_logo = req.body.p_company_logo;
     let p_TRN = req.body.p_TRN;
     let p_is_tax_applicable = req.body.p_is_tax_applicable;
     let p_tax_amount = req.body.p_tax_amount;
     let p_color = req.body.p_color;
     let p_is_head_office = req.body.p_is_head_office;
     await connection.query("call pr_save_company(?,?,?,?,?,?,?,?,?,?)", [p_company_id, p_company_name,p_company_short_name,p_company_ar_name,p_company_logo,p_TRN,p_is_tax_applicable,p_tax_amount,p_color,p_is_head_office], function (error, results, fields) {
      
        if (error) return res.send(error);
        return res.send(results[0]);
        });
     
    })















app.post('/api/Customer/NotifyMobile',  async function (req, res) {
  let p_mobile = req.body.p_mobile ;
   await connection.query("call pr_notifications (?)", [p_mobile], function (error, results, fields) {
     if (error) return res.send(error);
      return res.send(results[0]);
      });
     })
app.get('/api/global/GetCompany',  async function (req, res) {
  await connection.query('SELECT * FROM `Company`', function (error, results, fields) {
  
     if (error) return res.send(error);
     return res.send(results);
     });
  
 })
app.get('/api/Customer/GetOrders',  async function (req, res) {
  let p_service_id = req.body.primary_service_id;
 await connection.query('SELECT * FROM `orders` where  `primary_service_id`='+p_service_id, function (error, results, fields) {
    if (error) return res.send(error);
    return res.send(results);
    });
 
})
app.post('/api/Customer/NotifyMobile',  async function (req, res) {
 let p_mobile = req.body.p_mobile ;
  await connection.query("call pr_notifications (?)", [p_mobile], function (error, results, fields) {
    if (error) return res.send(error);
     return res.send(results[0]);
     });
    })
    app.post('/api/Customer/Wallet',  async function (req, res) {
     let p_customer_id = req.body.p_customer_id ;
      await connection.query("call pr_get_customer_wallet (?)", [p_customer_id], function (error, results, fields) {
        if (error) return res.send(error);
         return res.send(results[0]);
         });
        })
app.get('/api/Category/GetHomeCategory',  async function (req, res) {
  await connection.query('SELECT * FROM `home_service_categories`', function (error, results, fields) {
     if (error) return res.send(error);
     return res.send(results);
     });
  
 })
app.post('/api/Category/SubCategory',  async function (req, res) {
  
  let p_category_id = req.body.p_category_id;
  let p_sub_category_id = req.body.p_sub_category_id;
  let p_location = req.body.p_location;
  await connection.query("call pr_getSubCategory(?,?,?)", [p_category_id, p_sub_category_id,p_location], function (error, results, fields) {
   
     if (error) return res.send(error);
     return res.send(results[0]);
     });
  
 })
 app.post('/api/Category/GetMasterServiceFaq',  async function (req, res) {
   
   let p_service_id = req.body.p_service_id;
   let p_location_id = req.body.p_location_id;
   await connection.query("call Pr_GetMasterServiceFaq(?,?)", [p_service_id,p_location_id], function (error, results, fields) {
    
      if (error) return res.send(error);
      return res.send(results[0]);
      });
   
  })
  app.post('/api/Category/GetHomePageOfferBanner',  async function (req, res) {
    
    let p_location_id = req.body.p_location_id;
    await connection.query("call pr_home_page_offer_banner(?)", [p_location_id], function (error, results, fields) {
     
       if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
  
app.post('/api/Category/GetWhyMirror',  async function (req, res) {
  let p_category_id = req.body.p_category_id;
  await connection.query('SELECT * FROM `why_mirrors` where  `category_id`='+p_category_id, function (error, results, fields) {
     if (error) return res.send(error);
     return res.send(results);
     });
 })
 app.get('/api/Category/SearchService/:p_category_id/:p_service_name/:p_locationId',  async function (req, res) {
  let p_category_id = req.params.p_category_id;
  let p_service_name = req.params.p_service_name;
  let p_locationId = req.params.p_locationId;
  await connection.query("call pr_SearchServices(?,?,?)", [p_category_id, p_service_name,p_locationId], function (error, results, fields) {
   
     if (error) return res.send(error);
     return res.send(results[0]);
     });
  
 })
 app.get('/api/Category/GetService/:p_master_service_id/:p_category_id/:p_sub_category_id/:p_location',  async function (req, res) {
  let p_master_service_id = req.params.p_master_service_id;
  let p_category_id = req.params.p_category_id;
  let p_sub_category_id = req.params.p_sub_category_id;
  let p_location = req.params.p_location;
  await connection.query("call pr_GetService(?,?,?,?)", [p_master_service_id, p_category_id,p_sub_category_id,p_location], function (error, results, fields) {
     if (error) return res.send(error);
     return res.send(results[0]);
     });
  
 })
 app.post('/api/Category/GetServiceAmountByLocation',  async function (req, res) {
  let p_location_id = req.body.p_location_id;
   let p_master_service_ids = req.body.p_master_service_ids;
   await connection.query("call pr_GetServiceAmountByLocation(?,?)", [p_location_id,p_master_service_ids], function (error, results, fields) {
     if (error) return res.send(error);
      return res.send(results[0]);
      });
   
  })
  app.post('/api/Category/GetServiceOption',  async function (req, res) {
   let p_location_id = req.body.p_location_id;
    let p_master_service_ids = req.body.p_master_service_ids;
    await connection.query("call pr_GetServiceOption(?,?)", [p_location_id,p_master_service_ids], function (error, results, fields) {
      if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
app.post('/api/Category/ValidCouponCode',  async function (req, res) {
  let p_coupon_code = req.body.p_coupon_code;
  let p_customer_id = req.body.p_customer_id;
  let p_amount = req.body.p_amount;
  await connection.query("call Pr_ValidCouponCode(?,?,?)", [p_coupon_code,p_customer_id,p_amount], function (error, results, fields) {
    if (error) return res.send(error);
     return res.send(results[0]);
     });
  
 })
 app.get('/api/Category/GetCouponCount/',  async function (req, res) {
  
   await connection.query("call Pr_GetCouponCount()", function (error, results, fields) {
     if (error) return res.send(error);
      return res.send(results[0]);
      });
   
  })
  app.get('/api/Category/GetCouponList/',  async function (req, res) {
   
    await connection.query("call Pr_GetCouponList()", function (error, results, fields) {
      if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
   app.post('/api/Category/GetBookingSubCategoryCount',  async function (req, res) {
    let p_category_id = req.body.p_category_id;
    let p_location_id = req.body.p_location_id;
    await connection.query("call pr_get_booking_sub_category(?,?)", [p_category_id,p_location_id], function (error, results, fields) {
      if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
   app.post('/api/Category/SaveCancelOrderOffer',  async function (req, res) {
    let p_customer_id  = req.body.p_customer_id ;
    let p_amount  = req.body.p_amount ;
    await connection.query("call pr_save_cancel_order_offer(?,?)", [p_customer_id,p_amount], function (error, results, fields) {
      if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
   app.post('/api/Category/UpdateCancelOffer',  async function (req, res) {
    let p_customer_id  = req.body.p_customer_id ;
    await connection.query("call pr_update_cancel_offer (?)", [p_customer_id], function (error, results, fields) {
      if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
//#endregion

//#region   Customer API


app.post('/api/Integration/SMS',   function (req, res) {
  let p_mobile_number = req.body.p_mobile_number;
  p_msg = req.body.p_msg;
   
  let payload = {
    origin: config.sms.origin,
    destination: p_mobile_number,
    message: p_msg
}
console.log(payload)
 smsglobal.sms.send(payload, function (error, response) {

  if (error) return res.send(error);
  return res.send(response);
  
});
});
   
  

app.get('/api/Integration/SendSMS/:MobileNo/:CartSession',   function (req, res) {
  let p_mobile_number = req.params.MobileNo;
  let p_cart_session = req.params.CartSession;
  let p_otp=smsConfig.genrateOTP();
   let msg = config.sms.smsMsg;
   msg = msg.replace("{{otp}}", p_otp);
   
   connection.query("call pr_IUcustomerOtp(?,?,?)", [p_mobile_number,p_cart_session,p_otp], function (error, results, fields) {
    // if (error) return res.send(error);
    //  return res.send(results[0]);
     });
     let payload = {
      origin: config.sms.origin,
      destination: p_mobile_number,
      message: msg
  }
  
   smsglobal.sms.send(payload, function (error, response) {
    if (error) return res.send(error);
    return res.send(response);
    
  });
  
 })

app.get('/api/Customer/CheckCustomer/:p_phone',  async function (req, res) {
  let p_phone = req.params.p_phone;
  await connection.query("call pr_CheckCustomer(?)", [p_phone], function (error, results, fields) {
    if (error) return res.send(error);
     return res.send(results[0]);
     });
  
 })
 app.get('/api/Customer/GetCustomer/:p_customer_id',  async function (req, res) {
  let p_customer_id = req.params.p_customer_id;
  await connection.query('SELECT * FROM `customer`  where id='+p_customer_id, function (error, results, fields) {
     if (error) return res.send(error);
     return res.send(results);
     });
  
 })
 app.post('/api/Customer/DeleteCustomer',  async function (req, res) {
   let p_customer_id = req.body.p_customer_id;
   await connection.query("call pr_delete_customer(?)", [p_customer_id], function (error, results, fields) {
     if (error) return res.send(error);
      return res.send(results[0]);
      });
   
  })
 app.post('/api/Customer/SaveCustomerTip',  async function (req, res) {
   let p_customer_id = req.body.p_customer_id;
   let p_tip = req.body.p_tip;
   await connection.query("call pr_save_customer_tip(?,?)", [p_customer_id,p_tip], function (error, results, fields) {
     if (error) return res.send(error);
      return res.send(results[0]);
      });
   
  })
  app.post('/api/Customer/UpdateCustomerSetting',  async function (req, res) {
    let p_customer_id = req.body.p_customer_id;
    let p_is_whatsapp_update  = req.body.p_is_whatsapp_update ;
    let p_is_sms_update = req.body.p_is_sms_update;
    let p_is_email_update = req.body.p_is_email_update;
    await connection.query("call pr_update_customer_setting(?,?,?,?)", [p_customer_id,p_is_whatsapp_update,p_is_sms_update,p_is_email_update], function (error, results, fields) {
      if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
 app.get('/api/Customer/GetCustomerAddress/:p_customer_id/:p_id',  async function (req, res) {
   let p_customer_id = req.params.p_customer_id;
   let p_id = req.params.p_id;
   await connection.query("call pr_getCustomerAddress(?,?)", [p_customer_id,p_id], function (error, results, fields) {
     if (error) return res.send(error);
      return res.send(results[0]);
      });
   
  })
  app.get('/api/Customer/DeleteCustomerAddress/:p_id',  async function (req, res) {
    let p_id = req.params.p_id;
    await connection.query("call pr_deleteCustomerAddress(?)", [p_id], function (error, results, fields) {
      if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
   app.get('/api/Customer/GetCustomerCard/:p_id/:p_customer_Id',  async function (req, res) {
    let p_id = req.params.p_id;
    let p_customer_Id = req.params.p_customer_Id;
    await connection.query("call pr_getCustomerCard(?,?)", [p_id,p_customer_Id], function (error, results, fields) {
      if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
   app.get('/api/Customer/GetCustomerCard/:p_id/:p_customer_Id',  async function (req, res) {
    let p_id = req.params.p_id;
    let p_customer_Id = req.params.p_customer_Id;
    await connection.query("call pr_getCustomerCard(?,?)", [p_id,p_customer_Id], function (error, results, fields) {
      if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
   app.post('/api/Customer/DeleteCustomerCard',  async function (req, res) {
    let p_id = req.body.p_id;
    await connection.query("call pr_deleteCustomerCard(?)", [p_id], function (error, results, fields) {
      if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
   app.post('/api/Customer/SaveCustomerCard',  async function (req, res) {
    let p_customer_id = req.body.p_customer_id;
     let p_id = req.body.p_id;
     let p_card_name = req.body.p_card_name;
     let p_card_number = req.body.p_card_number;
     let p_card_expiry_month = req.body.p_card_expiry_month
     let p_card_expiry_year = req.body.p_card_expiry_year
     let p_cvv = req.body.p_cvv
     let p_card_type = req.body.p_card_type
     await connection.query("call pr_saveCustomerCard(?,?,?,?,?,?,?,?)", [p_customer_id,p_id,p_card_name,p_card_number,p_card_expiry_month,p_card_expiry_year,p_cvv,p_card_type], function (error, results, fields) {
       if (error) return res.send(error);
        return res.send(results[0]);
        });
     
    })
    app.post('/api/Customer/SaveCustomerAddress',  async function (req, res) {
      let p_id = req.body.p_id;
      let p_customer_id = req.body.p_customer_id;
      let p_address_type = req.body.p_address_type;
      let p_address_detail = req.body.p_address_detail;
      let p_address = req.body.p_address
      let p_lat = req.body.p_lat
      let p_lng = req.body.p_lng
      let p_name = req.body.p_name
      let p_email = req.body.p_email
      await connection.query("call pr_saveCustomerAddress(?,?,?,?,?,?,?,?,?)", [p_id,p_customer_id,p_address_type,p_address_detail,p_address,p_lat,p_lng,p_name,p_email], function (error, results, fields) {
        if (error) return res.send(error);
         return res.send(results[0]);
         });
      
     })


//#endregion

//#region  Customer Cart
app.get('/api/Customer/GetBookingCustomerCart/:p_customer_Id',  async function (req, res) {
  let p_id = req.params.p_customer_Id;
  await connection.query("call Pr_GetBookingCustomerCart(?)", [p_id], function (error, results, fields) {
    if (error) return res.send(error);
     return res.send(results[0]);
     });
  
 })

 app.post('/api/Customer/encrypt',   function (req, res) {

  let value = req.body.value;
  let model={
    val:encrypt(value)
  }
  return res.send(model);
  
 })
 app.post('/api/Customer/decrypt',   function (req, res) {

  let value = req.body.value;
  let model={
    val:decrypt(value)
  }
  return res.send(model);
  
 })
 app.post('/api/Customer/SaveBookingCart',  async function (req, res) {

  let p_customer_Id = req.body.p_customer_Id;
  let p_service_Id = req.body.p_service_Id;
  let p_qty = req.body.p_qty;
  await connection.query("call pr_saveBookingCart(?,?,?)", [p_customer_Id,p_service_Id,p_qty], function (error, results, fields) {
    if (error) return res.send(error);
     return res.send(results[0]);
     });
  
 })
 app.post('/api/Customer/SaveOrder',  async function (req, res) {
  let p_customer_id = req.body.p_customer_id;
  let p_payment_mode  = req.body.p_payment_mode ;
  let p_card_number = req.body.p_card_number;
  let p_location_id  = req.body.p_location_id ;
  let p_total_amount = req.body.p_total_amount;
  let p_discount_amount = req.body.p_discount_amount;
  let p_offer_amount  = req.body.p_offer_amount ;
  let p_member_amount   = req.body.p_member_amount  ;
  let p_tip_amount   = req.body.p_tip_amount  ;
  let p_vat_amount   = req.body.p_vat_amount  ;
  let p_grand_amount   = req.body.p_grand_amount  ;
  let p_coupon_code   = req.body.p_coupon_code  ;
  let p_slot_date    = req.body.p_slot_date  ;
  let p_slot_time    = req.body.p_slot_time ;
  let p_master_service_ids    = req.body.p_master_service_ids   ;
  let p_customer_address_id    = req.body.p_customer_address_id   ; 
let p_details=req.body.p_details;
  await connection.query("call pr_saveOrder(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [p_customer_id,p_payment_mode,p_card_number,p_location_id,p_total_amount,p_offer_amount,p_member_amount,p_tip_amount,p_vat_amount,p_grand_amount,p_coupon_code,p_slot_date,p_slot_time,p_customer_address_id,p_master_service_ids,p_discount_amount,p_details], function (error, results, fields) {
    if (error) return res.send(error);
     return res.send(results[0]);
     });
  
 })
 app.post('/api/Customer/UpdateOrderStatus',  async function (req, res) {
   let p_order_id = req.body.p_order_id;
   let p_status = req.body.p_status;
   let p_created_by = req.body.p_created_by;
   await connection.query("call 	pr_updateOrderStatus(?,?,?)", [p_order_id,p_status,p_created_by], function (error, results, fields) {
     if (error) return res.send(error);
      return res.send(results[0]);
      });
   
  })
  app.post('/api/Customer/CardPayementLog',  async function (req, res) {
    let p_order_id  = req.body.p_order_id ;
    let p_state = req.body.p_state;
    let p_request = req.body.p_request;
    let p_response = req.body.p_response;
    await connection.query("call 	pr_ng_payment(?,?,?,?)", [p_order_id,p_state,p_request,p_response], function (error, results, fields) {
      if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
  app.get('/api/Customer/GetBookingOrder/:p_order_id',  async function (req, res) {
    let p_order_id = req.params.p_order_id;
    await connection.query("call 	pr_GetBookingOrder(?)", [p_order_id], function (error, results, fields) {
      if (error) return res.send(error);
       return res.send(results[0]);
       });
    
   })
   app.get('/api/Customer/GetBookingOrderDetail/:p_order_id',  async function (req, res) {
     let p_order_id = req.params.p_order_id;
     await connection.query("call 	pr_GetBookingOrderDetail(?)", [p_order_id], function (error, results, fields) {
       if (error) return res.send(error);
        return res.send(results[0]);
        });
     
    })
    app.post('/api/Customer/Reschedule',  async function (req, res) {
      let p_order_id = req.body.p_order_id;
      let p_date_time_slot = req.body.p_date_time_slot;
      await connection.query("call 	pr_Reschedule(?,?)", [p_order_id,p_date_time_slot], function (error, results, fields) {
        if (error) return res.send(error);
         return res.send(results[0]);
         });
      
     })

     app.get('/api/Customer/GetCancellationReasons',  async function (req, res) {
      await connection.query('call pr_GetCancellationReason()',function (error, results, fields) {
         if (error) return res.send(error);
         return res.send(results);
         });
      
     })
     app.post('/api/Customer/CancelOrder',  async function (req, res) {
      let p_order_id = req.body.p_order_id;
      let p_reason_id = req.body.p_reason_id;
      let p_comment = req.body.p_comment;
      let p_created_by = req.body.p_created_by;
      await connection.query("call 	pr_CancelOrder(?,?,?,?)", [p_order_id,p_reason_id,p_comment,p_created_by], function (error, results, fields) {
        if (error) return res.send(error);
         return res.send(results[0]);
         });
      
     })
     app.post('/api/Customer/GetOrderService',  async function (req, res) {
      let p_customer_id = req.body.p_customer_id;
      await connection.query("call 	pr_getOrderService(?)", [p_customer_id], function (error, results, fields) {
        if (error) return res.send(error);
         return res.send(results[0]);
         });
      
     })
     app.post('/api/Category/GetCategoryBySlug',  async function (req, res) {
      let p_slug   = req.body.p_slug ;
      let p_location_id = req.body.p_location_id;
      await connection.query("call 	pr_GetCategoryBySlug(?,?)", [p_slug,p_location_id], function (error, results, fields) {
        if (error) return res.send(error);
         return res.send(results[0]);
         });
      
     })
     app.post('/api/Customer/UpdateProfile',  async function (req, res) {
      let p_customer_id = req.body.p_customer_id;
      let p_name = req.body.p_name;
      let p_phone = req.body.p_phone ;
      let p_email  = req.body.p_email ;
      let p_image = req.body.p_image;
      await connection.query("call 	pr_updateProfile(?,?,?,?,?)", [p_customer_id,p_name,p_phone,p_email,p_image], function (error, results, fields) {
        if (error) return res.send(error);
         return res.send(results[0]);
         });
      
     })
     app.get('/api/Blog/GetBlog',  async function (req, res) {
    
      await connection.query("call 	pr_GetBlog()",function (error, results, fields) {
        if (error) return res.send(error);
         return res.send(results[0]);
         });
      
     })
     app.post('/api/Blog/GetBlogDetail',  async function (req, res) {
      let p_link = req.body.p_link;
      await connection.query("call 	pr_GetBlogDetail(?)", [p_link], function (error, results, fields) {
        if (error) return res.send(error);
         return res.send(results[0]);
         });
      
     })
     
     // NodeJS example (using express.js framework)

async function getAuthToken() {
let val='';
  const  headers= {
    'Content-Type': 'application/vnd.ni-identity.v1+json',
    'Authorization': `Basic ${config.payment.PaymentKey}` /* This is the Service Account API key to make the payment */
  }
  let data={};
  await axios.post(config.payment.PaymentTokenUrl, data, {
      headers: headers
    })
    .then((response) => {
      
      val=response.data.access_token;
    })
    .catch((error) => {
     console.log(error)
    })
   
    return val;

}
async function ni_createPaymentOrder(data) {

let val;
  const accessToken = await getAuthToken();
  const  headers= {
    'Content-Type': 'application/vnd.ni-payment.v2+json',
    'Accept': 'application/vnd.ni-payment.v2+json',
    'Authorization': `Bearer ${accessToken}` /* This is the Service Account API key to make the payment */
  }
  await axios.post(config.payment.CreateOrdersUrl, data, {
      headers: headers
    })
    .then((response) => {
      
     val=response;
    })
    .catch((error) => {
     console.log(error)
    })
   
  console.log('orders ',val)
    return val;

}
app.post('/api/payment/nipayment', async (req, res) => {

  let data ={
    action:'PURCHASE',
    amount:{
      currencyCode:'AED',
      value:req.body.amount
    }
  }
 
  const accessToken = await getAuthToken();
  const order_detail = await ni_createPaymentOrder(data);
  console.log(order_detail)
  return order_detail;
  const  headers= {
    'Content-Type': 'application/vnd.ni-payment.v2+json',
    'Accept': 'application/vnd.ni-payment.v2+json',
    'Authorization': `Bearer ${accessToken}` /* This is the Service Account API key to make the payment */
  }
 
  await axios.post(config.payment.CreateOrdersUrl, data, {
      headers: headers
    })
    .then((response) => {
      console.log(response.data._links.payment)
     return res.send(response.data._links.payment);
    })
    .catch((error) => {
      return res.send(error.response);
    })
  
});
app.post('/api/payment/create-order', async (req, res) => {
  
  let data ={
    action:'PURCHASE',
    amount:{
      currencyCode:'AED',
      value:req.body.amount
    },
    merchantAttributes :{
      redirectUrl:req.body.redirectUrl,
      cancelUrl:req.body.cancelUrl,
      skipConfirmationPage:true
    },
    merchantDefinedData:req.body.merchantDefinedData
  }
 
  const accessToken = await getAuthToken();
  const order = await ni_createPaymentOrder();
  const  headers= {
    'Content-Type': 'application/vnd.ni-payment.v2+json',
    'Accept': 'application/vnd.ni-payment.v2+json',
    'Authorization': `Bearer ${accessToken}` /* This is the Service Account API key to make the payment */
  }
 
  await axios.post(config.payment.CreateOrdersUrl, data, {
      headers: headers
    })
    .then((response) => {
      console.log(response.data)
     return res.send(response.data);
    })
    .catch((error) => {
      return res.send(error.response);
    })
  
});
app.post('/api/payment/retrieve-order', async (req, res) => {
 
 
  const accessToken = await getAuthToken();
  const  headers= {
    'Content-Type': 'application/vnd.ni-payment.v2+json',
    'Accept': 'application/vnd.ni-payment.v2+json',
    'Authorization': `Bearer ${accessToken}` /* This is the Service Account API key to make the payment */
  }
 let url=config.payment.RetrieveOrder;
 url= url.replace("{outletId}",config.payment.PaymentOutletId);
 url= url.replace("{ref}",req.body.ref);
 console.log(url)
  await axios.get(url, {
      headers: headers
    })
    .then((response) => {
     console.log(response)
     return res.send(response.data);
    })
    .catch((error) => {
      console.log(response)
      return res.send(error.response);
    })
  
});
app.post('/api/payment/purchase', async (req, res) => {


  // let order ={
  //   action:'PURCHASE',
  //   amount:{
  //     currencyCode:'AED',
  //     value:req.body.amount
  //   }
  // }
  // let payment={
  //   pan:req.body.card_no,
  //   expiry:req.body.card_expiry,
  //   cvv:req.body.card_cvv,
  //   cardholderName:req.body.card_cardholderName
  // }
//   let data={
//     "order": {
//         "action":"PURCHASE",
//         "amount":{ "currencyCode":"AED", "value":req.body.amount }
//     },
//     "payment":{
//         "pan":req.body.card_no,
//         "expiry":req.body.card_expiry,
//         "cvv":req.body.card_cvv,
//         "cardholderName":req.body.card_cardholderName
//     }
// }
  let data={
    "order": {
        "action":"PURCHASE",
        "amount":{ "currencyCode":"AED", "value":req.body.amount }
    },
    "payment":{
        "pan":req.body.card_no,
        "expiry":req.body.card_expiry,
        "cvv":req.body.card_cvv,
        "cardholderName":req.body.card_holder_name
    }
}

  const accessToken = await getAuthToken();
  const  headers= {
    'Content-Type': 'application/vnd.ni-payment.v2+json',
    'Accept': 'application/vnd.ni-payment.v2+json',
    'Authorization': `Bearer ${accessToken}` /* This is the Service Account API key to make the payment */
   
  }

  await axios.post(config.payment.PaymentUrl, data, {
    headers: headers
  })
  .then((response) => {
    let dataRes=response.data
//     if(dataRes.state=='AWAIT_3DS'){
//       //  res.send( request.post(dataRes['3ds'].acsUrl).form({
//       //   PaReq: dataRes['3ds'].acsPaReq,
//       //   TermUrl: config.payment.TermUrl,
//       //   MD: dataRes['3ds'].acsMd
//       // }))
// let threeD={
//   PaReq: dataRes['3ds'].acsPaReq,
//   TermUrl: config.payment.TermUrl,
//   MD: dataRes['3ds'].acsMd
// }
//       const  headers1= {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         }
//        axios.post(dataRes['3ds'].acsUrl, threeD, {
//           headers: headers1
//         })
//         .then((response1) => {
//           console.log('HTML',response1.data)
//           let ab={
//             data:response1.data
//           }
//           return res.send(ab);
//         })
//         .catch((error) => {
//          console.log(error)
//         })

//     }
//     else{
//    return res.send(response.data);
//     }
return res.send(response.data);
  })
  .catch((error) => {
    return res.send(error.response);
  })
  // let data={
  //   "order":order,
  //   "payment":payment
  // };


  // await axios.post(config.payment.PaymentUrl, data, {
  //     headers: headers
  //   })
  //   .then((response) => {
  //    console.log(response.data)
      
  //    return res.send(response.data);
    //   let first_res=response.data;
    //  let acs={
    //   PaReq:first_res['3ds'].acsPaReq,
    //   MD:first_res['3ds'].acsMd,
    //   TermUrl:'http://localhost:3000'
    //  }

    //   axios.post(first_res['3ds'].acsUrl, acs, {
    //   headers: headers
    // })
    // .then((response1) => {
    //   console.log(response1.data)
    // //   let first_res=response.data;
    // //  let acs={
    // //   PaReq:first_res['3ds'].acsPaReq,
    // //   MD:first_res['3ds'].acsMd,
    // //   TermUrl:'http://localhost:3000'
    // //  }

    //  return res.send(response1.data);
    //  })
    // .catch((error) => {
    //   console.log('error',error)
    //   return res.send(error);
    // })
    // })
    // .catch((error) => {
    //   return res.send(error);
    // })
  
});
//#endregion
function encrypt(text){
  return cryptr.encrypt(text);
}
 
function decrypt(text){
  return cryptr.decrypt(text);
}

app.listen(process.env.PORT || 3000,function(){
   console.log('Node app is running on port 3000');
   });
   module.exports = app;