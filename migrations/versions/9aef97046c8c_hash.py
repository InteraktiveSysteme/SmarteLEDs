"""hash

Revision ID: 9aef97046c8c
Revises: c08039981f3d
Create Date: 2022-06-13 12:16:42.941225

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9aef97046c8c'
down_revision = 'c08039981f3d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('passwordHash', sa.String(length=120), nullable=True))
    op.drop_column('user', 'password')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('password', sa.INTEGER(), nullable=False))
    op.drop_column('user', 'passwordHash')
    # ### end Alembic commands ###