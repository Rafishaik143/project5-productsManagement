const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const {
  isValidData,
  isValidRequestBody,
  isValidObjectId,
  isValidPrice,
  isValidEnum,
} = require("../validator/validation");

console.log(a);
var a = 10;



const createCart = async (req, res) => {
  try {
    let userId = req.params.userId;
    if (!isValidObjectId.test(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid user id" });
    }

<<<<<<< HEAD
        let cartData = req.body;
=======
    let findUserId = await userModel.findById({ _id: userId });
    if (!findUserId) {
      return res
        .status(404)
        .send({ status: false, message: "User doesn't exists" });
    }

    let cartData = req.body;
>>>>>>> c02d6ffa4fe11c1a0faecf7685de084ba197e82d

    if (!isValidRequestBody(cartData)) {
      return res
        .status(400)
        .send({ status: false, message: "No data provided" });
    }

    let findCartId = await cartModel.findOne({ userId: userId });

    let { items, totalPrice, totalItems } = cartData;

    if (items.length !== 0) {
      let productId = items[0].productId;
      if (!isValidObjectId.test(productId)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid productid" });
      }
      let findProductId = await productModel.findById({ _id: productId });
      if (!findProductId) {
        return res
          .status(404)
          .send({ status: false, message: "product doesn't exists" });
      }
    }
    if (!findCartId) {
      if (!items) {
        let newCart = {
          items: [],
          totalPrice: 0,
          totalItems: 0,
          userId: userId,
        };

        let createCart = await cartModel.create(newCart);
        res.status(201).send({
          status: true,
          message: "Empty Cart Created",
          data: createCart,
        });
      }

      if (items) {
        let productId = items[0].productId;
        let findProduct = await productModel
          .findById(productId)
          .select({ price: 1, _id: 0 });

        let newProduct = {
          totalPrice: items[0].quantity * findProduct.price,
          totalItems: items[0].quantity,
          items: items,
          userId: userId,
        };

<<<<<<< HEAD
                let newProduct = {
                    totalPrice: findProduct.price,
                    totalItems: items.length,
                    items: items,
                    userId: userId
                }
                
                let createCart = await cartModel.create(newProduct);
                res.status(201).send({ status: true, message: "Cart Created", data: createCart });
            }
=======
        let createCart = await cartModel.create(newProduct);
        res.status(201).send({
          status: true,
          message: "Cart Created successfully",
          data: createCart,
        });
      }
    }

    if (findCartId) {
      let productId = items[0].productId;

      let findProduct = await productModel
        .findById(productId)
        .select({ price: 1, _id: 0 });
      let updateCart = await cartModel.findByIdAndUpdate(
        findCartId._id,
        {
          $push: { items: items },
          $inc: {
            totalPrice: items[0].quantity * findProduct.price,
            totalItems: items[0].quantity,
          },
        },
        { new: true }
      );
      res.status(200).send({
        status: true,
        message: "add to cart successfull",
        data: updateCart,
      });
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

const updateCart = async (req, res) => {
     try{
  let userId = req.params.userId;
  if (!isValidObjectId.test(userId)) {
    return res.status(400).send({ status: false, message: "Invalid user id" });
  }

  let findUserId = await userModel.findById({ _id: userId });
  if (!findUserId) {
    return res
      .status(404)
      .send({ status: false, message: "User doesn't exists" });
  }

  let cartData = req.body;
  if (!isValidRequestBody(cartData)) {
    return res.status(400).send({ status: false, message: "No data provided" });
  }

  let { cartId, productId, removeProduct } = cartData;

  if (!isValidObjectId.test(cartId)) {
    return res.status(400).send({ status: false, message: "invalid cartId" });
  }

  let findCartId = await cartModel
    .findById({ _id: cartId })
    .select({ items: 1 });
  if (!findCartId) {
    return res
      .status(404)
      .send({ status: false, message: "cartId doesn't exists" });
  }
  if (!isValidObjectId.test(productId)) {
    return res
      .status(400)
      .send({ status: false, message: "invalid productId" });
  }

  let findproductId = await productModel
    .findById({ _id: productId, isDeleted: false })
    .select({ price: 1 });
  if (!findproductId) {
    return res
      .status(404)
      .send({ status: false, message: "productId doesn't exists" });
  }
  if (findCartId.items.length == 0)
    return res.status(400).send({
      status: false,
      message: `your cart is already empty`,
    });
    // console.log(findCartId.items)
    // console.log(productId)
    let items = []
    for(let i=0;i<findCartId.items.length;i++){
        items.push(findCartId.items[i].productId.toString())
    }
    // console.log(items)

    if(!items.includes(productId)){
        return res.status(404).send({
            status: false,
            message: `no such product found in your cart with this id ${productId}`,
          });
      }

  if (removeProduct === 0) {
    let flag = 0;
    for (let i = 0; i < findCartId.items.length; i++) {
      if (findCartId.items[i].productId == productId) {
        //    console.log(removeProduct)
        let updateCart = await cartModel.findByIdAndUpdate(
          cartId,
          {
            $pull: { items: { productId: productId } },
            $inc: {
              totalPrice: -findproductId.price,
              totalItems: -findCartId.items[i].quantity,
            },
          },
          { new: true }
        );
        res.status(200).send({
          status: true,
          message: "product remove from cart successfully",
          data: updateCart,
        });
        flag = 1;
        break;
      }
    }
    if (flag === 0) {
      console.log("after flag");
    }
  }
  if (removeProduct === 1) {
    let flag = 0;
    for (let i = 0; i < findCartId.items.length; i++) {
        
      if (findCartId.items[i].productId == productId) {
       
        if (findCartId.items[i].quantity > 1) {
          findCartId.items[i].quantity = findCartId.items[i].quantity - 1;

          //    console.log(removeProduct)
          let updateCart = await cartModel.findByIdAndUpdate(
            cartId,
            {
              $set: { items: findCartId.items },
              $inc: { totalPrice: -findproductId.price, totalItems: -1 },
            },
            { new: true }
          );
          res.status(200).send({
            status: true,
            message: "product remove from cart successfully",
            data: updateCart,
          });
          flag = 1;
          break;
        } else {
          let updateCart = await cartModel.findByIdAndUpdate(
            cartId,
            {
              $pull: { items: { productId: productId } },
              $inc: {
                totalPrice: -findproductId.price,
                totalItems: -findCartId.items[i].quantity,
              },
            },
            { new: true }
          );
          res.status(200).send({
            status: true,
            message: "product remove from cart successfully",
            data: updateCart,
          });
>>>>>>> c02d6ffa4fe11c1a0faecf7685de084ba197e82d
        }
      }
      
    }
  }

  } catch (error) {
      res.status(500).send({ status: false, error: error.message });
  }
};

const getCart = async(req,res) =>{
  try{  let userId = req.params.userId
    if (!isValidObjectId.test(userId)) {
        return res.status(400).send({ status: false, message: "Invalid user id" })
    }

    let findUserId = await userModel.findById({ _id: userId });
    if (!findUserId) {
        return res.status(404).send({ status: false, message: "User doesn't exists" })
    }
    let findCartId = await cartModel.findOne({ userId: userId });
    if (!findCartId) {
        return res.status(404).send({ status: false, message: "cart is not created for this user" })
    }
    if (findCartId.items.length == 0)
    return res.status(400).send({
      status: false,
      message: `your cart is already empty`,
    });

    res.status(200).send({status:true,message:"fetch successfull",data:findCartId})


} catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

const deleteCart = async(req,res) =>{
    try{let userId = req.params.userId;
    if (!isValidObjectId.test(userId)) {
        return res.status(400).send({ status: false, message: "Invalid user id" })
    }

    let findUserId = await userModel.findById({ _id: userId });
    if (!findUserId) {
        return res.status(404).send({ status: false, message: "User doesn't exists" })
    }
    let findCartId = await cartModel.findOne({ userId: userId });
    if (!findCartId) {
        return res.status(404).send({ status: false, message: "cart is not created for this user" })
    }
    if (findCartId.items.length == 0)
    return res.status(400).send({
      status: false,
      message: `your cart is already deleted`,
    });
    let newCart = {
        items: [],
        totalPrice: 0,
        totalItems: 0,
      };

      let deleteCart = await cartModel.findByIdAndUpdate(findCartId._id,{$set:newCart},{new:true});
      res.status(200).send({
        status: true,
        message: "cart is deleted",
        data: deleteCart,
      });
} catch (error) {
    res.status(500).send({ status: false, message: error.message });
}


}


module.exports = { createCart, updateCart ,getCart,deleteCart};
