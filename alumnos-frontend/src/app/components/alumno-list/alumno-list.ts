import { Component, OnInit, inject, signal } from '@angular/core';
import { Alumno } from '../../models/alumno';
import { AlumnoService } from '../../services/alumno';

@Component({
  selector: 'app-alumno-list',
  imports: [],
  templateUrl: './alumno-list.html',
  styleUrl: './alumno-list.scss'
})
export class AlumnoList implements OnInit {
  private alumnoService = inject(AlumnoService);

  alumnos = signal<Alumno[]>([]);
  mensajeError = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.alumnoService.listar().subscribe({
      next: (data) => {
        this.alumnos.set(data);
        this.mensajeError.set('');
      },
      error: () =>
        this.mensajeError.set('No se pudo cargar la lista de alumnos. Verifique que el backend esté en ejecución.')
    });
  }

  eliminar(alumno: Alumno): void {
    if (!confirm(`¿Desea eliminar al alumno ${alumno.nombres}?`)) {
      return;
    }
    this.alumnoService.eliminar(alumno.id).subscribe({
      next: () => this.alumnos.update((lista) => lista.filter((a) => a.id !== alumno.id)),
      error: () => this.mensajeError.set('No se pudo eliminar el alumno.')
    });
  }
}