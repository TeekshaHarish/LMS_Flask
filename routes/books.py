from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Book

books_bp = Blueprint("books", __name__)

@books_bp.route("/books", methods=["GET"])
@jwt_required()
def get_books():
    query = request.args.get("q", "")
    page = int(request.args.get("page", 1))
    per_page = 10
    books = Book.query.filter(Book.title.ilike(f"%{query}%")).paginate(page, per_page, error_out=False)
    data = {
        "books": [{"id": b.id, "title": b.title, "author": b.author} for b in books.items],
        "page": books.page,
        "total_pages": books.pages,
    }
    return jsonify(data)

@books_bp.route("/books", methods=["POST"])
@jwt_required()
def add_book():
    data = request.json
    new_book = Book(title=data["title"], author=data["author"])
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": "Book added successfully"}), 201

@books_bp.route("/books/<int:id>", methods=["PUT"])
@jwt_required()
def update_book(id):
    data = request.json
    book = Book.query.get_or_404(id)
    book.title = data["title"]
    book.author = data["author"]
    db.session.commit()
    return jsonify({"message": "Book updated successfully"})

@books_bp.route("/books/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_book(id):
    book = Book.query.get_or_404(id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"})
