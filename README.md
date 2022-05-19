# SimuLed
This is a project actively developed as part of the IA/WEB Course of the TH Koeln. <br>


## Building

**Clone this repo :**
```bash
    # git clone https://github.com/InteraktiveSysteme/SmarteLEDs.git
```

## Development

**Pull the repo before working!!**
```bash
    # git pull
```
**Push**
```bash
    # git add <files> or --all
    # git commit -m <msg> 
    # git push origin main
```

**Merge**
```bash
    # git add <files> or --all
    # git commit -m <msg> 
    # git pull 
    
    Hetzt sollte ein Merge Konfikt entstehen. Im Editor auswaehlen welche Aenderungen behalten werden!
    
    # git add <files> or --all
    # git commit -m <msg> 
    # git push origin main
```
## HTML


**Images**

```bash
     <img class="d-block w-100" src="{{url_for('static', filename='/lamps/lampe.png')}}" alt="Placeholder">
```

**Jinja2**
```bash
     {% extends "base.html" %}
{% block title %}Index{% endblock %}
{% block head %}
    {{ super() }}
    <style type="text/css">
        .important { color: #336699; }
    </style>
{% endblock %}
{% block content %}
    Hier kommt deine HTML seite hin!
{% endblock %}
```
