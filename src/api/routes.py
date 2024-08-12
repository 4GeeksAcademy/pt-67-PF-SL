"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Photo, Order, OrderItems
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from msrest.authentication import ApiKeyCredentials
import os 

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

ENDPOINT = os.getenv("AZURE_ENDPOINT", "https://westeurope.api.cognitive.microsoft.com/")
project_id = os.getenv("AZURE_PROJECT_ID", "4a0d1a7e-a87e-43e2-838c-3eec869f5aeb")
prediction_key = os.getenv("AZURE_PREDICTION_KEY", "225ae10ed4e14b4ea2a4e56ac1a9474f")
publish_iteration_name = os.getenv("AZURE_ITERATION_NAME", "Iteration4")
prediction_credentials = ApiKeyCredentials(in_headers={"Prediction-key": prediction_key})
predictor = CustomVisionPredictionClient(ENDPOINT, prediction_credentials)

# Function to run predictions
def run_prediction(image_path):
    try:
        with open(image_path, mode="rb") as test_data:
            results = predictor.detect_image(project_id, publish_iteration_name, test_data)
        for prediction in results.predictions:
            print(f"\t{prediction.tag_name}: {prediction.probability:.2f}% bbox.left = {prediction.bounding_box.left:.2f}, bbox.top = {prediction.bounding_box.top:.2f}, bbox.width = {prediction.bounding_box.width:.2f}, bbox.height = {prediction.bounding_box.height:.2f}")
    except FileNotFoundError:
        print(f"File not found: {image_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example route to trigger prediction
@api.route('/predict', methods=['POST'])
def predict_image():
    data = request.get_json()
    image_path = data.get('image_path')
    run_prediction(image_path)
    return jsonify({"msg": "Prediction completed"}), 200

# Example of other existing routes

@api.route('/users', methods = ['GET'])
def get_users(): 
    users = User.query.all()
    users_serialized = list(map(lambda item:item.serialize(), users))
    response_body = {
        "message" : "Nice!",
        "data": users_serialized
    }
    if (users == []):
        return jsonify({"msg": "Not users yet"}), 404
    return jsonify(response_body), 200

@api.route('/users/<int:user_id>', methods = ['GET'])
def get_user(user_id): 
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"msg": "User not found"}), 404
        
    user_info = User.query.filter_by(id=user_id).first().serialize()    
    response_body = {
        "message" : "Nice!",
        "data": user_info
    }

    return jsonify(response_body), 200

@api.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    users_query = User.query.filter_by(email=email).first()
    if not users_query:
        return jsonify({"msg": "Doesn't exist"}), 402
    if password != users_query.password:
        return jsonify({"msg": "Bad username or password"}), 401
    print(users_query.role.value)

    additional_claims = {
        "user_id" : users_query.id,
        "user_username" : users_query.username,
        "role" : users_query.role.value
    }
    access_token = create_access_token(identity=users_query.id, additional_claims=additional_claims)
    return jsonify(access_token=access_token), 200

@api.route('/register', methods=['POST'])
def register():
    request_body = request.get_json()

    if User.query.filter_by(email=request_body["email"]).first():
        return jsonify({"msg": "Email already exists"}), 409
   
    user = User()
    user.new_user(
        email=request_body["email"],    
        password=request_body["password"],
        username=request_body["username"],
        name = request_body["name"],
        firstname = request_body["firstname"],
        role = request_body["role"]
    )
    additional_claims = {
        "user_id" : user.id,
        "user_username" : user.username,
        "role" : user.role.value
    }

    access_token = create_access_token(identity=request_body["email"], additional_claims=additional_claims)
    return jsonify(access_token=access_token), 200

@api.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        User.query.filter_by(id=user_id).delete()
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "User deleted"}), 200
    else:
        return jsonify({"msg": "User doesn't exist"}), 401
    
@api.route('/photos', methods=['POST'])
@jwt_required()
def add_photo():
    request_body = request.get_json()

    if Photo.query.filter_by(id=request_body["id"]).first():
        return jsonify({"msg": "Duplicated image"}), 409
    jtw_data = get_jwt()
    user_id = jtw_data["user_id"]
    photo = Photo()
    photo.new_photo(   
        url=request_body["url"],
        bicycle=request_body["bicycle"],
        helmet = request_body["helmet"],
        price = request_body["price"],
        user_id = user_id
    )

    db.session.add(photo)
    db.session.commit()

    return jsonify({"msg": "Photo created", "photo": photo.serialize()}),201

@api.route('/photos', methods = ['GET'])
@jwt_required()
def get_photos(): 
    photos = Photo.query.all()
    photos_serialized = list(map(lambda item:item.serialize(), photos))
    response_body = {
        "message" : "Nice photos!",
        "data": photos_serialized
    }
    if (photos == []):
        return jsonify({"msg": "Not photos yet"}), 404
    return jsonify(response_body), 200

@api.route('/photos/<int:photo_id>', methods = ['GET'])
@jwt_required()
def get_photo(photo_id): 
    photo = Photo.query.get(photo_id)
    if photo is None:
        return jsonify({"msg": "Photo not found"}), 404
        
    photo_info = Photo.query.filter_by(id=photo_id).first().serialize()
    response_body = {
        "message" : "Nice photo!",
        "data": photo_info
    }

    return jsonify(response_body), 200

@api.route('/photos/<int:photo_id>', methods=['DELETE'])
@jwt_required()
def delete_photo(photo_id):
    photo = Photo.query.get(photo_id)
    if photo:
        Photo.query.filter_by(id=photo_id).delete()
        db.session.delete(photo)
        db.session.commit()
        return jsonify({"msg": "Photo deleted"}), 200
    else:
        return jsonify({"msg": "Photo doesn't exist"}),401

@api.route('/orders', methods=['POST'])
@jwt_required()
def new_order():
    request_body = request.get_json()
    if Order.query.filter_by(id=request_body["id"]).first():
        return jsonify({"msg": "Duplicated order"}), 409
    jtw_data = get_jwt()
    user_id = jtw_data["user_id"]
    order = Order(
        id=request_body["id"],
        status=request_body["status"],
        payment_method=request_body["payment_method"],
        user_id= user_id
    )
    db.session.add(order)
    db.session.commit()

    return jsonify({"msg": "Order created", "order": order.serialize()}), 201


@api.route('/orders', methods = ['GET'])
@jwt_required()
def get_orders(): 
    orders = Order.query.all()
    orders_serialized = list(map(lambda item:item.serialize(), orders))
    response_body = {
        "message" : "ok!",
        "data": orders_serialized
    }
    if (get_orders == []):
        return jsonify({"msg": "Not orders yet"}), 404
    return jsonify(response_body), 200



@api.route('/orders/<int:order_id>', methods = ['GET'])
@jwt_required()
def get_order(order_id): 
    order = Order.query.get(order_id)
    if order is None:
        return jsonify({"msg": "Order not found"}), 404
        
    order_info = Order.query.filter_by(id=order_id).first().serialize()    
    response_body = {
        "message" : "ok!",
        "data": order_info
    }

    return jsonify(response_body), 200


@api.route('/orders/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    order = Order.query.get(order_id)
    if order:
        Order.query.filter_by(id=order_id).delete()
        db.session.delete(order)
        db.session.commit()
        return jsonify({"msg": "Order deleted"}), 200
    else:
        return jsonify({"msg": "Order doesn't exist"}), 401
    

@api.route('/orderitems', methods=['POST'])
@jwt_required()
def new_order_item():
    request_body = request.get_json()
    if not request_body:
        return jsonify({"msg": "Not found"}), 404

    order_item_id = request_body.get("id")
    order_id = request_body.get("order_id")
    photo_id = request_body.get("photo_id")

    if not all([order_item_id, order_id, photo_id]):
        return jsonify({"msg": "Missing fields"}), 400

    if OrderItems.query.filter_by(id=order_item_id).first():
        return jsonify({"msg": "Duplicated order item"}), 409

    order_item = OrderItems(
        id=order_item_id,
        order_id=order_id,
        photo_id=photo_id
    )
    db.session.add(order_item)
    db.session.commit()

    return jsonify({"msg": "Order item created", "order_item": order_item.serialize()}),
    
@api.route('/orderitems/<int:order_item_id>', methods=['GET'])
@jwt_required()
def get_order_item(order_item_id):
    order_item = OrderItems.query.get(order_item_id)
    if order_item is None:
        return jsonify({"msg": "Order item not found"}), 404

    order_item_info = order_item.serialize()
    response_body = {
        "message": "ok!",
        "data": order_item_info
    }

    return jsonify(response_body), 200

@api.route('/orderitems/<int:order_item_id>', methods=['DELETE'])
@jwt_required()
def delete_order_item(order_item_id):
    order_item = OrderItems.query.get(order_item_id)
    if order_item:
        db.session.delete(order_item)
        db.session.commit()
        return jsonify({"msg": "Order item deleted"}), 200
    else:
        return jsonify({"msg": "Order item doesn't exist"}), 404