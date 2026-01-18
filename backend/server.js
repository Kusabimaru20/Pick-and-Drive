const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'ucka.veleri.hr',
  user: 'ppilat',
  password: '11',
  database: 'ppilat'
});

// Ubacite komentare za API-je jer sine moj ovo je nemoguće na brzinu vidjet gdje sto pocinje gdje zavrsava

db.connect(err => {
  if (err) console.error('Greška pri spajanju:', err);
  else console.log('Povezano s MySQL bazom!');
});

// GET /automobili - svi automobili s lokacijom
app.get('/automobili', (req, res) => {
    const sql = `
        SELECT a.*, l.grad AS lokacija
        FROM automobili a
        LEFT JOIN lokacije l ON a.lokacija_id = l.id
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);

        results.forEach(r => {
            r.dostupno = r.dostupno === 1 ? 'Da' : 'Ne';
        });

    res.json(results);
  });
});

// GET /lokacije - lista svih lokacija
app.get('/lokacije', (req, res) => {
    const sql = 'SELECT * FROM lokacije';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// GET /pretraga - filtriranje po tipu, lokaciji
app.get('/pretraga', (req, res) => {
    const { marka, tip, mjenjac, gorivo, lokacija, dostupno} = req.query;
    let query = 'SELECT a.*, l.grad AS lokacija FROM automobili a JOIN lokacije l ON a.lokacija_id = l.id WHERE 1=1';
    const params = [];

    // Marke
    if (marka) {
        const markaArray = marka.split(',');
        query += ` AND marka IN (${markaArray.map(() => '?').join(',')})`;
        params.push(...markaArray);
    }

    // Tipovi
    if (tip) {
        const tipArray = tip.split(',');
        query += ` AND tip IN (${tipArray.map(() => '?').join(',')})`;
        params.push(...tipArray);
    }

    // Lokacija
    if (lokacija) {
        query += ` AND l.grad = ?`;
        params.push(lokacija);
    }

    // Dostupnost
    if(dostupno) { 
        query += ' AND dostupno = ?';
        params.push(dostupno);
    }

    //Mjenjač
    if(mjenjac) {
        query += ` AND mjenjac = ?`;
        params.push(mjenjac);
    }

    //Gorivo
    if(gorivo) {
        const gorArray = gorivo.split(',');
        query+= ` AND gorivo IN (${gorArray.map(() => '?').join(',')})`;
        params.push(...gorArray);
    }


    db.query(query, params, (err, results) => {
        if (err) return res.status(500).send(err);

        results.forEach(r => {
            r.dostupno = r.dostupno === 1;
        });

        res.json(results);
    });
});

app.post('/api/Korisnik', (req, res) => {
  const { ime, prezime, email, korisnicko_ime, lozinka } = req.body;

  db.query('SELECT MAX(id) AS maxId FROM korisnici', (err, results) => {
    if (err) {
      console.error("Greška pri dohvaćanju ID-a:", err);
      return res.status(500).json({ error: 'Greška na serveru' });
    }

    // Izracunava novi ID (ako nema nikoga u bazi, kreni od 1)
    const noviId = (results[0].maxId || 0) + 1;

    // Radi INSERT i salje je novi ID bazi
    const sql = `INSERT INTO korisnici (id, ime, prezime, email, korisnicko_ime, lozinka) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [noviId, ime, prezime, email, korisnicko_ime, lozinka], (insertErr, result) => {
      if (insertErr) {
        console.error("Greška pri upisu u bazu:", insertErr.sqlMessage);
        return res.status(500).json({ error: 'Baza odbija upis: ' + insertErr.sqlMessage });
      }

      // Javlja uspjeh
      res.status(200).json({ 
        message: 'Korisnik uspješno dodan!', 
        id: noviId 
      });
    });
  });
});


app.post('/api/prijava', (req, res) => {
  const { korisnicko_ime, lozinka } = req.body;

  if (!korisnicko_ime || !lozinka) {
    return res.status(400).json({ error: 'Sva polja su obavezna' });
  }

  const sql = `SELECT * FROM korisnici WHERE korisnicko_ime = ? AND lozinka = ?`;
  db.query(sql, [korisnicko_ime, lozinka], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Greška u bazi' });
    }

    if (results.length > 0) {
      res.json({ message: 'Prijava uspješna', korisnik: results[0] });
    } else {
      res.status(401).json({ error: 'Neispravno korisničko ime ili lozinka' });
    }
  });
});

// Dohvat svih korisnika iz baze
app.get('/api/korisnici', (req, res) => {
  const sql = 'SELECT id, ime, prezime, korisnicko_ime, email FROM korisnici';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Greška pri dohvatu:', err);
      return res.status(500).json({ error: 'Greška u bazi podataka' });
    }
    res.json(results);
  });
});

app.get('/api/user', (req, res) => {
  const userId = parseInt(req.headers['x-user-id']);

  db.query(
    'SELECT id, ime, prezime, korisnicko_ime FROM korisnici WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Greška u bazi' });
      if (results.length === 0) return res.status(404).json({ error: 'Korisnik ne postoji' });

      res.json(results[0]);
    }
  );
});


app.put('/api/user', (req, res) => {
  const userId = parseInt(req.headers['x-user-id']);


  const {
    ime,
    prezime,
    korisnicko_ime,
  } = req.body;


  db.query( 'SELECT * FROM korisnici WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Greška u bazi' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Korisnik ne postoji' });
      }

      const korisnik = results[0];
      const fields = [];
      const values = [];

      if (ime) {
        fields.push('ime = ?');
        values.push(ime);
      }

      if (prezime) {
        fields.push('prezime = ?');
        values.push(prezime);
      }

      if (korisnicko_ime) {
        fields.push('korisnicko_ime = ?');
        values.push(korisnicko_ime);
      }

      // Ako nema promjena
      if (fields.length === 0) {
        return res.json({ message: 'Nema promjena' });
      }

      values.push(userId);

      const sql = `
        UPDATE korisnici
        SET ${fields.join(', ')}
        WHERE id = ?
      `;

      db.query(sql, values, err => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Greška pri spremanju' });
        }

        res.json({ message: 'Podaci uspješno ažurirani' });
      });
    }
  );
});


// Brisanje korisnika po ID-u
app.delete('/api/Korisnik/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM korisnici WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Greška pri brisanju:', err);
      return res.status(500).json({ error: 'Greška u bazi podataka' });
    }
    res.json({ message: 'Korisnik uspješno obrisan' });
  });
});

app.get('/Admin', (req, res) => {
  const { adminId } = req.query;

  if (!adminId) {
    return res.status(400).json({ error: 'Admin ID nije poslan' });
  }

  const sql = `
    SELECT COUNT(*) AS id_exists
    FROM admin
    WHERE admin_id = ?
  `;

  db.query(sql, [adminId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Greška u bazi' });
    }

    res.json(result);
  });
});

// Dohvat svih vozila
app.get("/api/admin/vozila", (req, res) => {
  const sql = "SELECT * FROM automobili";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Dodavanje vozila
app.post("/api/admin/vozila", (req, res) => {
  const {
    naziv, marka, godina, tip, gorivo,
    mjenjac, slika, opis, dostupno, lokacija_id
  } = req.body;

  const sql = `
    INSERT INTO automobili
    (naziv, marka, godina, tip, gorivo, mjenjac, slika, opis, dostupno, lokacija_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    naziv, marka, godina, tip, gorivo,
    mjenjac, slika, opis, dostupno, lokacija_id
  ], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Vozilo dodano" });
  });
});

// Brisanje vozila
app.delete("/api/admin/vozila/:id", (req, res) => {
  const sql = "DELETE FROM automobili WHERE id = ?";
  db.query(sql, [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Vozilo obrisano" });
  });
});

// Dohvat svih lokacija - copy paste sam uzela od vozila samo promjenila values
app.get("/api/admin/lokacije", (req, res) => {
  const sql = "SELECT * FROM lokacije";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Dodavanje lokacija - isto ko gore
app.post("/api/admin/lokacije", (req, res) => {
  const {
    grad, adresa, longitude, latitude, telefon, email
  } = req.body;

  const sql = `
    INSERT INTO lokacije
    (grad, adresa, longitude, latitude, telefon, email)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    grad, adresa, longitude, latitude, telefon, email
  ], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Vozilo dodano" });
  });
});

// Brisanje lokacije
app.delete("/api/admin/lokacije/:id", (req, res) => {
  const sql = "DELETE FROM lokacije WHERE id = ?";
  db.query(sql, [req.params.id], err => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Vozilo obrisano" });
  });
});

app.get("/api/admin/rezervacije", (req, res) => {
  const sql = `
    SELECT 
      rezervacije.id, 
      rezervacije.datum_od, 
      rezervacije.datum_do, 
      rezervacije.ukupna_cijena,
      rezervacije.status,
      automobili.naziv AS auto_naziv, 
      korisnici.korisnicko_ime
      FROM rezervacije
      JOIN automobili ON rezervacije.automobil_id = automobili.id
      JOIN korisnici ON rezervacije.korisnik_id = korisnici.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("SQL Greška:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.json(results);
  });
});

app.get('/api/rezervacije/moje', (req, res) => {
  const userIdHeader = req.headers['x-user-id'];  // case-insensitive

  if (!userIdHeader) {
    return res.status(401).json({ error: 'Nedostaje X-User-ID header.' });
  }

  const userId = parseInt(userIdHeader);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Netočan ID format.' });
  }

  db.query(
    'SELECT rez.id, ' +
    'aut.naziv, ' +
    'rez.datum_od, ' +
    'rez.datum_do, ' +
    'rez.ukupna_cijena, ' +
    'rez.status ' +
    'FROM rezervacije rez left join automobili aut on rez.automobil_id = aut.id ' +
    'WHERE korisnik_id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    }
  );
});

app.patch('/api/rezervacije/:id/otkazi', (req, res) => {
  const rezervacijaId = parseInt(req.params.id);
  const userIdHeader = req.headers['x-user-id'];

  if (!userIdHeader || isNaN(parseInt(userIdHeader))) {
    return res.status(400).json({ error: 'nepostojeći ili nepoznati ID korisnika' });
  }

  const userId = parseInt(userIdHeader);

  
  db.query(
    'UPDATE rezervacije SET status = "Otkazano" WHERE id = ? AND korisnik_id = ?',
    [rezervacijaId, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Greška u bazi' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Rezervacija nije pronađena ili nije "Potvrđeno"' });
      }

      res.json({ success: true, message: 'Rezervacija otkazana' });
    }
  );
});

app.get("/api/automobili-potrebnapolja", (req, res) => {
  // SQL upit za dohvaćanje SVIH potrebnih polja, dodan naziv i slike + kasnije dodana dostupnost i id za rezervacije, maknut model jer se ne koristi
  const query = "SELECT id, naziv, godina, tip, gorivo, mjenjac, slika, opis, dostupno FROM automobili";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Greška pri dohvaćanju automobila:", err);
      res
        .status(500)
        .json({ error: "Greška servera pri dohvaćanju podataka iz baze." });
    } else {
      res.json(results);
    }
  });
});

app.post('/rezervacije', (req, res) => {
  console.log('BODY:', req.body)
  console.log('HEADERS:', req.headers)
  const { automobil_id, datum_od, datum_do } = req.body
  const korisnik_id = Number(req.headers['x-user-id'])
  const odKad = new Date(datum_od)
  const doKad = new Date(datum_do)

  if (doKad <= odKad) {
    return res.status(400).json({ error: 'Datum do mora biti nakon datuma od' })
  }

  const dani = Math.ceil((doKad - odKad) / (1000 * 60 * 60 * 24))

  // SELECT
  db.query(
    'SELECT cijena_dan FROM automobili WHERE id = ?',
    [automobil_id],
    (err, rows) => {
      if (err) {
      return res.status(500).json({ error: 'Greška baze (SELECT)' })
      }

      const ukupna_cijena = dani * rows[0].cijena_dan

      // INSERT
      db.query(
        `INSERT INTO rezervacije
         (korisnik_id, automobil_id, datum_od, datum_do, ukupna_cijena)
         VALUES (?, ?, ?, ?, ?)`,
        [korisnik_id, automobil_id, datum_od, datum_do, ukupna_cijena],
        (err) => {
          if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Greška baze (INSERT)' });
          }
        res.status(200).json({ message: 'Uspjeh!' });
        }
      )
    }
  );
});

app.listen(3000, () => console.log('Server radi na portu 3000'));