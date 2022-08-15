from project import app, db, migrate

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'migrate':migrate}
