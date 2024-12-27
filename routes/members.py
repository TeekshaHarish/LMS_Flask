from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Member

members_bp = Blueprint("members", __name__)

@members_bp.route("/members", methods=["GET"])
@jwt_required()
def get_members():
    query = request.args.get("q", "")
    page = int(request.args.get("page", 1))
    per_page = 10
    members = Member.query.filter(Member.name.ilike(f"%{query}%")).paginate(page, per_page, error_out=False)
    data = {
        "members": [{"id": m.id, "name": m.name, "email": m.email} for m in members.items],
        "page": members.page,
        "total_pages": members.pages,
    }
    return jsonify(data)

@members_bp.route("/members", methods=["POST"])
@jwt_required()
def add_member():
    data = request.json
    new_member = Member(name=data["name"], email=data["email"])
    db.session.add(new_member)
    db.session.commit()
    return jsonify({"message": "Member added successfully"}), 201

@members_bp.route("/members/<int:id>", methods=["PUT"])
@jwt_required()
def update_member(id):
    data = request.json
    member = Member.query.get_or_404(id)
    member.name = data["name"]
    member.email = data["email"]
    db.session.commit()
    return jsonify({"message": "Member updated successfully"})

@members_bp.route("/members/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_member(id):
    member = Member.query.get_or_404(id)
    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "Member deleted successfully"})
