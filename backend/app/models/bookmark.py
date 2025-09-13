from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from ..core.database import Base
from sqlalchemy.orm import relationship


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    recipe_id = Column(Integer)

    # 중복 레시피 찜 방지
    __table_args__ = (UniqueConstraint("user_id", "recipe_id", name="unique_user_recipe"),)

    user = relationship("User", back_populates="bookmarks")