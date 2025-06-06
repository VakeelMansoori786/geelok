var express = require('express');
var app = express();
var mysql = require('mysql');
let config = require('./config');
let smsConfig = require('./Integration/sms');
var bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer(); // You can configure storage if needed
const path = require("path");
var axios = require('axios')
const fs = require("fs");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
const request = require('request');
let authMiddleware = require('./utility/authMiddleware');
const jwt = require('jsonwebtoken');
const cors = require('cors');
// Allow all origins
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));
app.use(express.json());
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


 app.post('/api/global/GetLogin',  async function (req, res) {
  
  let p_username = req.body.p_username;
  let p_password = req.body.p_password;
  let p_company_id = req.body.p_company_id;
 
  await connection.query("call pr_login(?,?,?)", [p_username,p_password,p_company_id], function (error, results, fields) {
   
     if (error) return res.send(error);
     if (results.length > 0) {

       const rows = results;
       const payload = { user: rows[0] };
       const token = jwt.sign(payload, config.JWT_SERECT_KEY, config.JWT_OPTION);
      
       const decoded = jwt.decode(token);
       res.json({ token: token, user: rows[0],menu:rows[1] });
       
     } else {
       return res.json({ message: 'Invalid username or password' });
     }
     });
  
 })



 app.post('/api/global/GetCompanyUser',  async function (req, res) {
  
  let p_user_id = req.body.p_user_id;
  await connection.query("call pr_get_company_user(?)", [p_user_id], function (error, results, fields) {
   
     if (error) return res.send(error);
     return res.send(results[0]);
     });
  
 })

 app.post('/api/global/GetUserList',  async function (req, res) {
  
  let p_company_id = req.body.p_company_id;
  let p_role_id = req.body.p_role_id;
  await connection.query("call pr_get_users(?,?)", [p_company_id,p_role_id], function (error, results, fields) {
   
     if (error) return res.send(error);
     return res.send(results[0]);
     });
  
 })


 app.post('/api/item/GetItem', authMiddleware , async function (req, res) {
  console.log(req.user.user[0])
  let p_item_id = req.body.p_item_id;
  let p_user_id = req.user.user[0].user_id;
  let p_company_id = req.user.user[0].company_id;
  await connection.query("call pr_get_item(?,?,?)", [p_item_id,p_user_id,p_company_id], function (error, results, fields) {
   
     if (error) return res.send(error);
     if(p_item_id!='0') return res.send(results);
     return res.send(results[0]);
     });
  
 })

 app.post('/api/item/GetItemByName', authMiddleware , async function (req, res) {
  let name = req.body.name;
  await connection.query("SELECT  * FROM `item` WHERE name like '%"+name+"%'  LIMIT 10", function (error, results, fields) {
   
    if (error) return res.send(error);
    return res.send(results);
     });
  
 })
 app.post('/api/item/SaveItem', authMiddleware, upload.none(), async function (req, res) {
  let p_item_id = req.body.p_item_id;
  let p_item_group_id = req.body.p_item_group_id;
  let p_brand_id = req.body.p_brand_id;
  let p_unit_id = req.body.p_unit_id;
  let p_country_id = req.body.p_country_id;
  let p_item_type = req.body.p_item_type;
  let p_name = req.body.p_name;
  let p_image = req.body.p_image;
  let p_model_no = req.body.p_model_no;
  let p_hs_code = req.body.p_hs_code;
  let p_cost_price = req.body.p_cost_price;
  let p_dimensions = req.body.p_dimensions;
  let p_weight = req.body.p_weight;
  let p_is_taxable = req.body.p_is_taxable;
  let p_create_by = req.user.user[0].user_id;
  let p_description = req.body.p_description;
  let p_item_stock = req.body.p_item_stock;
    
  await connection.query(
      "CALL pr_save_item(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)",
      [
          p_item_id,
          p_item_group_id,
          p_brand_id,
          p_unit_id,
          p_country_id,
          p_item_type,
          p_name,
          p_image,
          p_model_no,
          p_hs_code,
          p_cost_price,
          p_dimensions,
          p_weight,
          p_is_taxable,
          p_create_by,
          p_description,
          p_item_stock
      ],
      function (error, results, fields) {
          if (error) return res.send(error);
          return res.send(results[0]);
      }
  );
});
app.post('/api/item/GetItemTransaction', authMiddleware, upload.none(), async function (req, res) {
  let p_type = req.body.p_type;
  let p_item_id = req.body.p_item_id;
  
    
  await connection.query(
      "CALL pr_get_item_transaction(?,?)",
      [
        p_type,
        p_item_id
      ],
      function (error, results, fields) {
          if (error) return res.send(error);
          return res.send(results[0]);
      }
  );
});
app.post('/api/item/SaveTransferOrder', authMiddleware, async function (req, res) {
  let p_transfer_order_id = req.body.p_transfer_order_id;
  let p_reason = req.body.p_reason;
  let p_from_company_id = req.body.p_from_company_id;
  let p_to_company_id = req.body.p_to_company_id;
  let p_create_by = req.user.user[0].user_id;
  let p_order_details = req.body.p_order_details; // Expecting this to be an array of items



    await connection.query(
          "CALL pr_save_transfer_order(?, ?, ?, ?, ?, ?)",
          [
              p_transfer_order_id,
              p_reason,
              p_from_company_id,
              p_to_company_id,
              p_create_by,
              p_order_details
            ],
            function (error, results, fields) {
                if (error) return res.send(error);
                return res.send(results[0]);
            }
        );
      });

      app.post('/api/item/GetTransferOrder', authMiddleware, async function (req, res) {
        let p_transfer_order_id = req.body.p_transfer_order_id;

      
      
      
          await connection.query(
                "CALL pr_get_transferOrderDetails(?)",
                [
                    p_transfer_order_id
                  ],
                  function (error, results, fields) {
                      if (error) return res.send(error);
                    if(p_transfer_order_id!='0') return res.send(results);
                      return res.send(results[0]);
                  }
              );
            });
      


            app.post('/api/item/GetCompanyItemStock', authMiddleware , async function (req, res) {
              let p_item_id = req.body.p_item_id;
            
              await connection.query("call pr_get_company_item_stock(?)", [p_item_id], function (error, results, fields) {
               
                 if (error) return res.send(error);
              
                 return res.send(results[0]);
                 });
              
             })


app.get('/api/global/GetBrand',  async function (req, res) {
 await connection.query('SELECT * FROM `brand` where is_active=1', function (error, results, fields) {
  console.log(error)
    if (error) return res.send(error);
    return res.send(results);
    });
 
})
app.get('/api/global/GetUnit',  async function (req, res) {
 await connection.query('SELECT * FROM `unit` where is_active=1', function (error, results, fields) {
  console.log(error)
    if (error) return res.send(error);
    return res.send(results);
    });
 
})
app.get('/api/global/GetPaymentTerm',  async function (req, res) {
  await connection.query('SELECT * FROM `payment_term` where is_active=1', function (error, results, fields) {
   console.log(error)
     if (error) return res.send(error);
     return res.send(results);
     });
  
 })
app.get('/api/global/GetTax',  async function (req, res) {
  await connection.query('SELECT * FROM `tax_treatment` where is_active=1', function (error, results, fields) {
   console.log(error)
     if (error) return res.send(error);
     return res.send(results);
     });
    })
app.get('/api/global/GetCountry',  async function (req, res) {
 await connection.query('SELECT * FROM `country` where is_active=1', function (error, results, fields) {
  console.log(error)
    if (error) return res.send(error);
    return res.send(results);
    });
 
})
app.get('/api/global/GetItemGroup',  async function (req, res) {
 await connection.query('SELECT * FROM `item_group` where is_active=1', function (error, results, fields) {
  console.log(error)
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
  app.post('/api/global/GetAddress',  async function (req, res) {
   
    let p_address_type  = req.body.p_address_type ;
    let p_id  = req.body.p_id ;
    await connection.query("call pr_get_address(?,?)", [p_address_type, p_id], function (error, results, fields) {
     
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
   app.get('/api/global/GetCurrency',  async function (req, res) {
     await connection.query('SELECT * FROM `currency` where is_active=1', function (error, results, fields) {
    
        if (error) return res.send(error);
        return res.send(results);
        });
     
    })
   app.get('/api/global/GetCurrency',  async function (req, res) {
     await connection.query('SELECT * FROM `currency` where is_active=1', function (error, results, fields) {
    
        if (error) return res.send(error);
        return res.send(results);
        });
     
    })
    app.get('/api/global/GetAccount',  async function (req, res) {
      await connection.query('SELECT * FROM `account` where is_active=1', function (error, results, fields) {
     
         if (error) return res.send(error);
         return res.send(results);
         });
      
     })
  app.get('/api/global/GetCompanyAddress',  async function (req, res) {
    let company_id = req.body.company_id;
   await connection.query('SELECT * FROM `company_address` where  `is_active`=1 and  `company_id`='+company_id, function (error, results, fields) {
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

//#region Purchase

//#region Expenses
app.post('/api/purchase/SaveExpense', authMiddleware, async function (req, res) {
  let p_expense_id = req.body.p_expense_id || 0;
  let p_customer_id = req.body.p_customer_id;
  let p_branch_id = req.body.p_branch_id;
  let p_expense_date = req.body.p_expense_date;
  let p_ref_no = req.body.p_ref_no;
  let p_payment_type_id = req.body.p_payment_type_id;
  let p_payment_term_id = req.body.p_payment_term_id;
  let p_currency_id = req.body.p_currency_id;

  let p_is_billable = req.body.p_is_billable || 0;
  let p_sub_total = req.body.p_sub_total;
  let p_tax = req.body.p_tax;
  let p_total = req.body.p_total;
  let p_create_by = req.user.user[0].user_id;
  let p_expense_details = req.body.p_expense_details;

  try {
    await connection.query(
      "CALL pr_save_expense(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)",
      [
        p_expense_id,
        p_customer_id,
        p_branch_id,
        p_expense_date,
        p_payment_type_id,
        p_payment_term_id,
        p_currency_id,
        p_is_billable,
        p_sub_total,
        p_tax,
        p_total,
        p_create_by,
        p_expense_details,
        p_ref_no
      ],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});
app.post('/api/purchase/GetExpense', authMiddleware, async function (req, res) {
  let p_expense_id = req.body.p_expense_id;




    await connection.query(
          "CALL pr_get_Expense(?)",
          [
            p_expense_id
            ],
            function (error, results, fields) {
                if (error) return res.send(error);
              if(p_expense_id!='0') return res.send(results);
                return res.send(results[0]);
            }
        );
      });

//#endregion


//#region Payable
app.post('/api/purchase/SavePayable', authMiddleware, async function (req, res) {
  let p_purchase_payable_id = req.body.p_purchase_payable_id || 0;
  let p_customer_id = req.body.p_customer_id;
  let p_branch_id = req.body.p_branch_id;
  let p_payment_date = req.body.p_payment_date;
  let p_cheque_date = req.body.p_cheque_date || null;
  let p_other_ref_no = req.body.p_other_ref_no || null;
  let p_payment_type_id = req.body.p_payment_type_id;
  let p_currency_id = req.body.p_currency_id;
  let p_total_amount = req.body.p_total_amount;
  let p_create_by = req.user.user[0].user_id;
  let p_purchase_payable_details = req.body.p_purchase_payable_details;

  try {
    await connection.query(
      "CALL pr_save_purchase_payable(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        p_purchase_payable_id,
        p_customer_id,
        p_branch_id,
        p_currency_id,
        p_payment_type_id,
        p_payment_date,
        p_cheque_date,
        p_other_ref_no,
        p_total_amount,
        p_create_by,
        p_purchase_payable_details
      ],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

app.post('/api/purchase/GetPayable', authMiddleware, async function (req, res) {
  let p_purchase_payable_id = req.body.p_purchase_payable_id;

  try {
    await connection.query(
      "CALL pr_get_PurchasePayable(?)",
      [p_purchase_payable_id],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });
        if (p_purchase_payable_id != '0') return res.status(200).send(results);
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

app.post('/api/purchase/GetCustomerPayable', authMiddleware, async function (req, res) {
  let p_customer_id = req.body.p_customer_id;

  try {
    await connection.query(
      "CALL pr_get_customerPayable(?)",
      [p_customer_id],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });
        return res.status(200).send(results[0]);
        
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

//#endregion



//#region Purchase Order
app.post('/api/purchase/SaveOrder', authMiddleware, async function (req, res) {
  let p_purchase_order_id = req.body.p_purchase_order_id || 0;
  let p_customer_id = req.body.p_customer_id;
  let p_branch_id = req.body.p_branch_id;
  let p_delivery_type = req.body.p_delivery_type;
  let p_delivery_type_id = req.body.p_delivery_type_id;
  let p_delivery_address_id = req.body.p_delivery_address_id;
  let p_payment_term_id = req.body.p_payment_term_id;
  let p_currency_id = req.body.p_currency_id;

  let p_delivery_date = req.body.p_delivery_date;
  let p_purchase_order_date = req.body.p_purchase_order_date;
  let p_notes = req.body.p_notes;
  let p_sub_total = req.body.p_sub_total;
  let p_tax = req.body.p_tax;
  let p_discount = req.body.p_discount;
  let p_total = req.body.p_total;
  let p_status = req.body.p_status || 1;
  let p_create_by = req.user.user[0].user_id;
  let p_order_details = req.body.p_order_details;

  try {
    await connection.query(
      "CALL pr_save_purchase_order(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        p_purchase_order_id,
        p_customer_id,
        p_branch_id,
        p_delivery_type,
        p_delivery_type_id,
        p_delivery_address_id,
        p_payment_term_id,
        p_currency_id,
        p_delivery_date,
        p_purchase_order_date,
        p_notes,
        p_sub_total,
        p_tax,
        p_discount,
        p_total,
        p_status,
        p_create_by,
        p_order_details
      ],
      function (error, results, fields) {
     
        if (error) return res.status(500).send({ error: error.message });
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});
app.post('/api/purchase/GetOrder', authMiddleware, async function (req, res) {
  let p_purchase_order_id = req.body.p_purchase_order_id;




    await connection.query(
          "CALL pr_get_PurchaseOrder(?)",
          [
            p_purchase_order_id
            ],
            function (error, results, fields) {
                if (error) return res.send(error);
              if(p_purchase_order_id!='0') return res.send(results);
                return res.send(results[0]);
            }
        );
      });

//#endregion

//#region Bill


app.post('/api/purchase/SaveBill', authMiddleware, async function (req, res) {
  let p_purchase_bill_id = req.body.p_purchase_bill_id;
  let p_customer_id = req.body.p_customer_id;
  let p_branch_id = req.body.p_branch_id;
  let p_currency_id = req.body.p_currency_id;
  let p_payment_term_id = req.body.p_payment_term_id;
  let p_bill_no = req.body.p_bill_no;
  let p_order_no = req.body.p_order_no;
  let p_permit_no = req.body.p_permit_no;
  let p_bill_date = req.body.p_bill_date;
  let p_due_date = req.body.p_due_date;
  let p_notes = req.body.p_notes; 
  let p_sub_total = req.body.p_sub_total; 
  let p_tax = req.body.p_tax; 
  let p_discount = req.body.p_discount; 
  let p_total = req.body.p_total; 
  let p_create_by = req.user.user[0].user_id;
  let p_order_details = req.body.p_order_details; 



    await connection.query(
          "CALL pr_save_purchase_bill(?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?,? )",
          [
            p_purchase_bill_id,
            p_customer_id,
            p_branch_id,
            p_bill_no,
            p_order_no,
            p_permit_no,
            p_bill_date,
            p_notes,
            p_sub_total,
            p_tax,
            p_discount,
            p_total,
              p_create_by,
              p_order_details,
              p_due_date,
              p_currency_id,
              p_payment_term_id
            ],
            function (error, results, fields) {
                if (error) return res.send(error);
                return res.send(results[0]);
            }
        );
      });
     
      
      app.post('/api/purchase/GetBill', authMiddleware, async function (req, res) {
        let p_purchase_bill_id = req.body.p_purchase_bill_id;

      
      
      
          await connection.query(
                "CALL pr_get_PurchaseBill(?)",
                [
                  p_purchase_bill_id
                  ],
                  function (error, results, fields) {
                      if (error) return res.send(error);
                    if(p_purchase_bill_id!='0') return res.send(results);
                      return res.send(results[0]);
                  }
              );
            });

//#endregion


//#endregion

//#region Sales

//#region Performa Invoice
app.post('/api/sales/SaveProformaInvoice', authMiddleware, async function (req, res) {
  let p_performa_invoice_id = req.body.p_performa_invoice_id || 0;
  let p_customer_id = req.body.p_customer_id;
  let p_branch_id = req.body.p_branch_id;
  let p_billing_address_id = req.body.p_billing_address_id;
  let p_shipping_address_id = req.body.p_shipping_address_id;
  let p_payment_term_id = req.body.p_payment_term_id;
  let p_currency_id = req.body.p_currency_id;
  let p_other_ref_no = req.body.p_other_ref_no;
  let p_performa_invoice_date = req.body.p_performa_invoice_date;
  let p_purchase_order_date = req.body.p_purchase_order_date;
  let p_notes = req.body.p_notes;
  let p_sub_total = req.body.p_sub_total;
  let p_tax = req.body.p_tax;
  let p_discount = req.body.p_discount;
  let p_total = req.body.p_total;
  let p_status = req.body.p_status || 1;
  let p_create_by = req.user.user[0].user_id;
  let p_invoice_details = req.body.p_invoice_details;

  try {
    await connection.query(
      "CALL pr_save_performa_invoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        p_performa_invoice_id,
        p_customer_id,
        p_branch_id,
        p_billing_address_id,
        p_shipping_address_id,
        p_payment_term_id,
        p_currency_id,
        p_other_ref_no,
        p_performa_invoice_date,
        p_purchase_order_date,
        p_notes,
        p_sub_total,
        p_tax,
        p_discount,
        p_total,
        p_status,
        p_create_by,
        p_invoice_details
      ],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});
app.post('/api/sales/GetProformaInvoice', authMiddleware, async function (req, res) {
  let p_performa_invoice_id = req.body.p_performa_invoice_id;

  try {
    await connection.query(
      "CALL pr_get_PerformaInvoice(?)",
      [p_performa_invoice_id],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });

        // If a specific ID is passed, return all related records
        if (p_performa_invoice_id != '0') {
          return res.status(200).send(results);
        }

        // If ID is 0, return the general list
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});


//#endregion



//#region Delivery Note
app.post('/api/sales/SaveDeliveryNote', authMiddleware, async function (req, res) {
  let p_delivery_note_id = req.body.p_delivery_note_id || 0;
  let p_customer_id = req.body.p_customer_id;
  let p_branch_id = req.body.p_branch_id;
  let p_billing_address_id = req.body.p_billing_address_id;
  let p_shipping_address_id = req.body.p_shipping_address_id;
  let p_payment_term_id = req.body.p_payment_term_id;
  let p_currency_id = req.body.p_currency_id;
  let p_other_ref_no = req.body.p_other_ref_no;
  let p_purchase_order_no = req.body.p_purchase_order_no;
  let p_performa_invoice_date = req.body.p_performa_invoice_date;
  let p_purchase_order_date = req.body.p_purchase_order_date;
  let p_notes = req.body.p_notes;
  let p_sub_total = req.body.p_sub_total;
  let p_tax = req.body.p_tax;
  let p_discount = req.body.p_discount;
  let p_total = req.body.p_total;
  let p_status = req.body.p_status || 1;
  let p_create_by = req.user.user[0].user_id;
  let p_invoice_details = req.body.p_invoice_details;

  try {
    await connection.query(
      "CALL pr_save_delivery_note(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
      [
        p_delivery_note_id,
        p_customer_id,
        p_branch_id,
        p_billing_address_id,
        p_shipping_address_id,
        p_payment_term_id,
        p_currency_id,
        p_other_ref_no,
        p_performa_invoice_date,
        p_purchase_order_date,
        p_notes,
        p_sub_total,
        p_tax,
        p_discount,
        p_total,
        p_status,
        p_create_by,
        p_invoice_details,
        p_purchase_order_no
      ],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});
app.post('/api/sales/GetDeliveryNote', authMiddleware, async function (req, res) {
  let p_delivery_note_id = req.body.p_delivery_note_id;

  try {
    await connection.query(
      "CALL pr_get_delivery_note(?)",
      [p_delivery_note_id],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });

        // If a specific ID is passed, return all related records
        if (p_delivery_note_id != '0') {
          return res.status(200).send(results);
        }

        // If ID is 0, return the general list
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});


//#endregion

//#region Invoice
app.post('/api/sales/SaveInvoice', authMiddleware, async function (req, res) {
  // Extract input parameters from the request body
  let p_invoice_id = req.body.p_invoice_id || 0;
  let p_customer_id = req.body.p_customer_id;
  let p_branch_id = req.body.p_branch_id;
  let p_billing_address_id = req.body.p_billing_address_id;
  let p_shipping_address_id = req.body.p_shipping_address_id;
  let p_payment_term_id = req.body.p_payment_term_id;
  let p_currency_id = req.body.p_currency_id;
  let p_person_id = req.body.p_person_id;
  let p_other_ref_no = req.body.p_other_ref_no;
  let p_purchase_order_date = req.body.p_purchase_order_date;
  let p_purchase_order_no = req.body.p_purchase_order_no;
  let p_delivery_note_date = req.body.p_delivery_note_date;
  let p_delivery_note_no = req.body.p_delivery_note_no;
  let p_invoice_date = req.body.p_invoice_date;
  let p_invoice_due_date = req.body.p_invoice_due_date;
  let p_bill_type = req.body.p_bill_type;
  let p_notes = req.body.p_notes;
  let p_sub_total = req.body.p_sub_total;
  let p_tax = req.body.p_tax;
  let p_discount = req.body.p_discount;
  let p_total = req.body.p_total;
  let p_status = req.body.p_status || 1;
  let p_create_by = req.user.user[0].user_id; // Authenticated user's ID
  let p_invoice_details = req.body.p_invoice_details;

  try {
    // Call the stored procedure
    await connection.query(
      "CALL pr_save_invoice(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        p_invoice_id,
        p_customer_id,
        p_branch_id,
        p_billing_address_id,
        p_shipping_address_id,
        p_payment_term_id,
        p_currency_id,
        p_person_id,
        p_other_ref_no,
        p_purchase_order_date,
        p_purchase_order_no,
        p_delivery_note_date,
        p_delivery_note_no,
        p_invoice_date,
        p_notes,
        p_sub_total,
        p_tax,
        p_discount,
        p_total,
        p_status,
        p_create_by,
        p_invoice_details, // Pass JSON details as a string
        p_invoice_due_date,
        p_bill_type
      ],
      function (error, results) {
     
        if (error) {
          return res.status(500).send({ error: error.message });
        }
        // Return the stored procedure result
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});
app.post('/api/GetPreview', async function (req, res) {
  let p_id = req.body.p_id;
  let p_type = req.body.p_type;

  try {
    await connection.query(
      "CALL pr_get_preview(?,?)",
      [p_id,p_type],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });

          return res.status(200).send(results);
       

      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});
app.post('/api/sales/GetInvoice', authMiddleware, async function (req, res) {
  let p_invoice_id = req.body.p_invoice_id;

  try {
    await connection.query(
      "CALL pr_get_invoice(?)",
      [p_invoice_id],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });

        // If a specific ID is passed, return all related records
        if (p_invoice_id != '0') {
          return res.status(200).send(results);
        }

        // If ID is 0, return the general list
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});
app.post('/api/sales/GetInvoiceByCustomer', authMiddleware, async function (req, res) {
  let p_customer_id = req.body.p_customer_id;

  try {
    await connection.query(
      "CALL pr_get_invoice_by_customer(?)",
      [p_customer_id],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });


        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});


//#endregion


//#region  Credit Note

app.post('/api/sales/SaveCreditNote', authMiddleware, async function (req, res) {
  // Extract input parameters from the request body
  let p_credit_note_id = req.body.p_credit_note_id || 0;
  let p_customer_id = req.body.p_customer_id;
  let p_branch_id = req.body.p_branch_id;
  let p_invoice_id = req.body.p_invoice_id;
  let p_billing_address_id = req.body.p_billing_address_id;
  let p_shipping_address_id = req.body.p_shipping_address_id;
  let p_currency_id = req.body.p_currency_id;
  let p_person_id = req.body.p_person_id;
  let p_other_ref_no = req.body.p_other_ref_no;
  let p_purchase_order_no = req.body.p_purchase_order_no;
  let p_credit_note_date = req.body.p_credit_note_date;
  let p_notes = req.body.p_notes;
  let p_sub_total = req.body.p_sub_total;
  let p_tax = req.body.p_tax;
  let p_discount = req.body.p_discount;
  let p_total = req.body.p_total;
  let p_status = req.body.p_status || 1;
  let p_create_by = req.user.user[0].user_id; // Authenticated user's ID
  let p_credit_note_details = req.body.p_credit_note_details;

  try {
    // Call the stored procedure for saving the credit note
    await connection.query(
      "CALL pr_save_credit_note(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
      [
        p_credit_note_id,
        p_customer_id,
        p_branch_id,
        p_invoice_id,
        p_billing_address_id,
        p_shipping_address_id,
        p_currency_id,
        p_person_id,
        p_other_ref_no,
        p_purchase_order_no,
        p_credit_note_date,
        p_notes,
        p_sub_total,
        p_tax,
        p_discount,
        p_total,
        p_status,
        p_create_by,
        p_credit_note_details, // Pass the JSON details as a string
      ],
      function (error, results) {
        if (error) {
          return res.status(500).send({ error: error.message });
        }
        // Return the result message from the stored procedure
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});


app.post('/api/sales/GetCreditNote', authMiddleware, async function (req, res) {
  let p_credit_note_id = req.body.p_credit_note_id;

  try {
    await connection.query(
      "CALL pr_get_credit_note(?)",
      [p_credit_note_id],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });

        // If a specific ID is passed, return all related records
        if (p_credit_note_id != '0') {
          return res.status(200).send(results);
        }

        // If ID is 0, return the general list
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

//#endregion
//#region 




//#region Receivable
app.post('/api/sales/SaveReceiveable', authMiddleware, async function (req, res) {
  let p_sales_receiveable_id = req.body.p_sales_receiveable_id || 0;
  let p_customer_id = req.body.p_customer_id;
  let p_branch_id = req.body.p_branch_id;
  let p_payment_date = req.body.p_payment_date;
  let p_cheque_date = req.body.p_cheque_date || null;
  let p_other_ref_no = req.body.p_other_ref_no || null;
  let p_payment_type_id = req.body.p_payment_type_id;
  let p_currency_id = req.body.p_currency_id;
  let p_total_amount = req.body.p_total_amount;
  let p_create_by = req.user.user[0].user_id;
  let p_sales_receiveable_details = req.body.p_sales_receiveable_details;

  try {
    await connection.query(
      "CALL pr_save_sales_receiveable(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        p_sales_receiveable_id,
        p_customer_id,
        p_branch_id,
        p_currency_id,
        p_payment_type_id,
        p_payment_date,
        p_cheque_date,
        p_other_ref_no,
        p_total_amount,
        p_create_by,
        p_sales_receiveable_details
      ],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

app.post('/api/sales/GetReceiveable', authMiddleware, async function (req, res) {
  let p_sales_receiveable_id = req.body.p_sales_receiveable_id;

  try {
    await connection.query(
      "CALL pr_get_SalesReceivable(?)",
      [p_sales_receiveable_id],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });
        if (p_sales_receiveable_id != '0') return res.status(200).send(results);
        return res.status(200).send(results[0]);
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

app.post('/api/purchase/GetCustomerReceiveable', authMiddleware, async function (req, res) {
  let p_customer_id = req.body.p_customer_id;
  let p_sales_receiveable_id = req.body.p_sales_receiveable_id;

  try {
    await connection.query(
      "CALL pr_get_customerReceivable(?,?)",
      [p_customer_id,p_sales_receiveable_id],
      function (error, results, fields) {
        if (error) return res.status(500).send({ error: error.message });
        return res.status(200).send(results[0]);
        
      }
    );
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});
//#endregion






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
 app.get('/api/global/GetPaymentType',  async function (req, res) {
   await connection.query('SELECT * FROM `payment_type` where is_active=1', function (error, results, fields) {
   
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
 app.post('/api/Customer/GetCustomer',  async function (req, res) {
  let p_customer_id = req.body.p_customer_id;
  await connection.query("call pr_get_CustomerDetailsById(?)", [p_customer_id], function (error, results, fields) {
    if (error) return res.send(error);
     return res.send(results[0]);
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

  await axios.get(url, {
      headers: headers
    })
    .then((response) => {
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